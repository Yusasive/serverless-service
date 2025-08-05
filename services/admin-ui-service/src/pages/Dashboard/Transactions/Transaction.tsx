import React, { useState, useEffect } from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTable from '@/components/datatable/Datatable';
import { BoothController } from '@/controllers/BoothController';
import { UserController } from '@/controllers/UserController';
import { TransactionData, TransactionStats } from '@/types/transaction.type';
import { User } from '@/types/user.type';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Badge from '@/components/ui/Badge';
import { CreditCard, DollarSign, Calendar, Search, Filter, Mail } from 'lucide-react';
import { sendInvoiceEmail } from '@/utils/invoiceEmailService';
import { InvoiceData, generateInvoiceNumber, formatInvoiceDate, calculateDueDate } from '@/utils/invoiceUtils';
import { getDefaultLogoPath, preloadLogo } from '@/utils/logoUtils';
import ViewTransactionModal from '@/components/modals/ViewTransactionModal';
import UpdateTransactionStatusModal from '@/components/modals/UpdateTransactionStatusModal';
import { useUser } from '@/context/UserContext';

const Transactions: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<TransactionData[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    total: 0,
    pending: 0,
    paid: 0,
    refunded: 0,
    abandoned: 0,
    byStatus: [],
    byMonth: []
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<number | null>(null);
  const [invoiceStatus, setInvoiceStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState<TransactionData | null>(null);

  const boothController = new BoothController();
  const userController = UserController.getInstance();
  const { user: currentUser } = useUser();

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [allTransactions, selectedStatus, selectedPaymentStatus, searchTerm]);

  const calculateStats = () => {
    const total = allTransactions.length;
    const pending = allTransactions.filter(t => t.paymentStatus === 'pending').length;
    const paid = allTransactions.filter(t => t.paymentStatus === 'paid').length;
    const refunded = allTransactions.filter(t => t.paymentStatus === 'refunded').length;
    const abandoned = allTransactions.filter(t => t.paymentStatus === 'abandoned').length;

    setStats({
      total,
      pending,
      paid,
      refunded,
      abandoned,
      byStatus: [],
      byMonth: []
    });
  };

  const handleRetry = () => {
    setError(null);
    loadTransactions();
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const transactionData = await boothController.getAllTransactions();
      setAllTransactions(transactionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      setAllTransactions([]); 
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let currentTransactions = [...allTransactions];

    if (selectedStatus !== 'all') {
      currentTransactions = currentTransactions.filter(transaction => 
        transaction.boothTransStatus === selectedStatus
      );
    }

    if (selectedPaymentStatus !== 'all') {
      currentTransactions = currentTransactions.filter(transaction => 
        transaction.paymentStatus === selectedPaymentStatus
      );
    }

    if (searchTerm.trim()) {
      currentTransactions = currentTransactions.filter(transaction => 
        transaction.transactionId.toString().includes(searchTerm) ||
        transaction.remark?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(currentTransactions);
  };

  const handleSendInvoiceEmail = async (transaction: TransactionData) => {
    try {
      setSendingInvoice(transaction.transactionId);
      setInvoiceStatus(null);

      // Get user information for the transaction
      let user: User | null = null;
      if (transaction.userId) {
        try {
          user = await userController.getUserById(transaction.userId);
        } catch (error) {
          console.warn('Failed to get user details:', error);
        }
      }

      // Group booths by sector (location) for cleaner invoice
      const boothGroups = transaction.booths.reduce((groups, booth) => {
        const sector = booth.sector || 'General';
        if (!groups[sector]) {
          groups[sector] = [];
        }
        groups[sector].push(booth);
        return groups;
      }, {} as Record<string, typeof transaction.booths>);

      // Prepare invoice data
      const invoiceData: InvoiceData = {
        invoiceNumber: generateInvoiceNumber(),
        date: formatInvoiceDate(new Date(transaction.reservationDate)),
        dueDate: calculateDueDate(new Date(transaction.reservationDate)),
        customerInfo: {
          name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Valued Customer' : 'Valued Customer',
          company: user?.company || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: user?.address?.[0]?.address_line1 || '',
          city: user?.address?.[0]?.city || '',
          state: user?.address?.[0]?.state || '',
          postalCode: '',
          country: user?.address?.[0]?.country || 'Nigeria'
        },
        items: Object.entries(boothGroups).map(([location, booths]) => ({
          location: location,
          boothNames: booths.map(booth => booth.boothNum).join(', '),
          totalArea: booths.map(booth => {
            const numericPart = booth.boothType?.match(/\d+/)?.[0];
            return numericPart ? Number(numericPart) : 0;
          }).reduce((acc, curr) => acc + curr, 0),
          total: transaction.totalAmount
        })),
        total: transaction.totalAmount,
        currency: 'NGN',
        paymentMethod: 'Online Payment',
        reservationIds: [transaction.transactionId.toString()]
      };

      // Send invoice email
      const recipientEmail = user?.email;
      if (!recipientEmail) {
        throw new Error('No email address found for this transaction');
      }

      const logoBase64 = await preloadLogo(getDefaultLogoPath());
      await sendInvoiceEmail(invoiceData, recipientEmail, { logo: logoBase64 || undefined });
      
      setInvoiceStatus({
        success: true,
        message: `Invoice sent successfully to ${recipientEmail}`
      });

      // Clear status after 5 seconds
      setTimeout(() => {
        setInvoiceStatus(null);
      }, 5000);

    } catch (error) {
      console.error('Failed to send invoice email:', error);
      setInvoiceStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send invoice email'
      });

      // Clear status after 5 seconds
      setTimeout(() => {
        setInvoiceStatus(null);
      }, 5000);
    } finally {
      setSendingInvoice(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedStatus('all');
    setSelectedPaymentStatus('all');
    setSearchTerm('');
  };

  const handleViewTransaction = (transaction: TransactionData) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = (transaction: TransactionData) => {
    setUpdatingTransaction(transaction);
    setIsUpdateStatusModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleStatusUpdate = async (transactionId: number, newStatus: string) => {
    try {
      // Update the transaction status using the booth controller
      await boothController.updatePaymentStatus(transactionId, newStatus, currentUser?.user_id);
      
      // Reload transactions to reflect the changes
      await loadTransactions();
      
      // Show success message
      setInvoiceStatus({
        success: true,
        message: `Transaction status updated successfully to ${newStatus}`
      });

      // Clear status after 5 seconds
      setTimeout(() => {
        setInvoiceStatus(null);
      }, 5000);
    } catch (error) {
      console.error('Failed to update transaction status:', error);
      throw error;
    }
  };

  // const handleEditTransaction = (transaction: TransactionData) => {
  //   alert(`Editing transaction: ${transaction.transactionId}`);
  // };

  // const handleDeleteTransaction = (transaction: TransactionData) => {
  //   if (window.confirm(`Are you sure you want to delete transaction: ${transaction.transactionId}?`)) {
  //     alert(`Deleting transaction: ${transaction.transactionId}`);
  //   }
  // };


  const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return boothController.formatCurrency(amount, currency);
  };

  const getStatusBadge = (status: string) => {
    const color = boothController.getStatusBadgeColor(status);
    const label = boothController.getStatusLabel(status);
    
    return (
      <Badge className={color}>
        {label}
      </Badge>
    );
  };

  const columns: TableColumn<TransactionData>[] = [
    {
      name: 'Transaction ID',
      selector: (row) => row.transactionId,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Amount',
      selector: (row) => row.totalAmount,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
    },
    {
      name: 'Status',
      selector: (row) => row.boothTransStatus,
      sortable: true,
      cell: (row) => getStatusBadge(row.boothTransStatus),
    },
    {
      name: 'Payment Status',
      selector: (row) => row.paymentStatus,
      sortable: true,
      cell: (row) => getStatusBadge(row.paymentStatus),
    },
    {
      name: 'Booths',
      selector: (row) => row.booths?.length || 0,
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.booths?.length || 0} booth{row.booths?.length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      name: 'Booth Numbers',
      selector: (row) => row.booths?.map(booth => booth.boothNum).join(', ') || '',
      sortable: false,
      cell: (row) => (
        <div className="max-w-[250px]">
          {row.booths && row.booths.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.booths.map((booth, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md"
                  title={`${booth.boothNum} - ${booth.sector || 'General'}`}
                >
                  {booth.boothNum} ({booth.sector || 'General'})
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No booths</span>
          )}
        </div>
      ),
    },
    {
      name: 'Reservation Date',
      selector: (row) => row.reservationDate ? new Date(row.reservationDate).getTime() : 0,
      sortable: true,
      cell: (row) => row.reservationDate ? new Date(row.reservationDate).toLocaleDateString() : 'N/A',
    },
    {
      name: 'Actions',
      selector: (row) => row.transactionId,
      sortable: false,
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewTransaction(row)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="View Transaction"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleSendInvoiceEmail(row)}
            disabled={sendingInvoice === row.transactionId}
            className={`p-1 rounded transition-colors ${
              sendingInvoice === row.transactionId
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
            }`}
            title={sendingInvoice === row.transactionId ? 'Sending Invoice...' : 'Send Invoice Email'}
          >
            {sendingInvoice === row.transactionId ? (
              <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </button>
          {row.paymentStatus === 'pending' && (
            <button
              onClick={() => handleUpdateStatus(row)}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
              title="Update Payment Status"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {/* <button
            onClick={() => handleEditTransaction(row)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Edit Transaction"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button> */}
          {/* <button
            onClick={() => handleDeleteTransaction(row)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Delete Transaction"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button> */}
        </div>
      ),
    },
  ];

  if (loading && allTransactions.length === 0) {
    return <LoadingOverlay isLoading={true} message="Loading transactions..." />;
  }

  return (
    <div className="space-y-6">
      {/* Invoice Status Notification */}
      {invoiceStatus && (
        <div className={`p-4 rounded-lg border ${
          invoiceStatus.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              invoiceStatus.success ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="font-medium">{invoiceStatus.message}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600">Manage and view all transaction information</p>
        </div>
        {/* <button
          onClick={handleExportTransactions}
          disabled={exportLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          {exportLoading ? 'Exporting...' : 'Export Transactions'}
        </button> */}
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex flex-wrap items-end gap-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">

          {/* Search */}
          <div className="flex flex-col">
            <label htmlFor="search" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-blue-500" />
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by transaction id..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="min-w-[250px] bg-white border border-gray-300 text-sm rounded-lg px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label htmlFor="status-filter" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-green-500" />
              Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="min-w-[120px] bg-white border border-gray-300 text-sm rounded-lg px-2 py-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex flex-col">
            <label htmlFor="payment-status-filter" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-purple-500" />
              Payment Status
            </label>
            <select
              id="payment-status-filter"
              value={selectedPaymentStatus}
              onChange={e => setSelectedPaymentStatus(e.target.value)}
              className="min-w-[120px] bg-white border border-gray-300 text-sm rounded-lg px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Clear All */}
          <div className="ml-auto flex flex-col">
            <button
              onClick={handleClearFilters}
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors underline"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Active Filters as Pills */}
        {(selectedStatus !== 'all' || selectedPaymentStatus !== 'all' || searchTerm) && (
          <div className="flex gap-2 flex-wrap mt-3">
            {searchTerm && (
              <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center">
                Search: {searchTerm}
                <button
                  className="ml-2 font-bold text-blue-400 hover:text-blue-600"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search filter"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs flex items-center">
                Status: {boothController.getStatusLabel(selectedStatus)}
                <button
                  className="ml-2 font-bold text-green-500 hover:text-green-700"
                  onClick={() => setSelectedStatus('all')}
                  aria-label="Clear status filter"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedPaymentStatus !== 'all' && (
              <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs flex items-center">
                Payment: {boothController.getStatusLabel(selectedPaymentStatus)}
                <button
                  className="ml-2 font-bold text-purple-500 hover:text-purple-700"
                  onClick={() => setSelectedPaymentStatus('all')}
                  aria-label="Clear payment status filter"
                >
                  &times;
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                {error.includes('authentication') && (
                  <p className="mt-1 text-xs">Please ensure you are logged in and try again.</p>
                )}
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {selectedStatus !== 'all' || selectedPaymentStatus !== 'all' || searchTerm ? 'Filtered' : 'Total'} Transactions
              </p>
              <p className="text-2xl font-semibold text-gray-900">{filteredTransactions.length}</p>
              {(selectedStatus !== 'all' || selectedPaymentStatus !== 'all' || searchTerm) && (
                <p className="text-xs text-gray-500">of {stats.total} total</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Paid</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.paid}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Refunded</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.refunded}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        title="Transaction Data"
        columns={columns}
        data={filteredTransactions}
        loading={loading}
        pagination={true}
      />

      {/* View Transaction Modal */}
      <ViewTransactionModal
        transaction={selectedTransaction}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTransaction(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Update Transaction Status Modal */}
      <UpdateTransactionStatusModal
        transaction={updatingTransaction}
        isOpen={isUpdateStatusModalOpen}
        onClose={() => {
          setIsUpdateStatusModalOpen(false);
          setUpdatingTransaction(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Transactions;
