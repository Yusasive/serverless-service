import React, { useState, useEffect } from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTable from '@/components/datatable/Datatable';
import { BoothController } from '@/controllers/BoothController';
import { BoothData, BoothSector } from '@/types/booth.type';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Badge from '@/components/ui/Badge';
import EditBoothModal from '@/components/modals/EditBoothModal';
import ViewBoothModal from '@/components/modals/ViewBoothModal';
import { Briefcase, Flag, Tags } from 'lucide-react';

const Booths: React.FC = () => {
  const [allBooths, setAllBooths] = useState<BoothData[]>([]);
  const [filteredBooths, setFilteredBooths] = useState<BoothData[]>([]);
  const [sectors, setSectors] = useState<BoothSector[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<BoothData | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewBooth, setViewBooth] = useState<BoothData | null>(null);

  const boothController = new BoothController();

  useEffect(() => {
    loadBooths();
    loadSectors();
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    applyFilters();
    extractCategories();
  }, [allBooths, selectedSector, selectedStatus, selectedCategory]);

  // Add a retry mechanism for authentication errors
  const handleRetry = () => {
    setError(null);
    loadBooths();
    loadSectors();
  };

  // Action handlers
  const handleViewBooth = (booth: BoothData) => {
    setViewBooth(booth);
    setViewModalOpen(true);
  };

  const handleEditBooth = (booth: BoothData) => {
    setSelectedBooth(booth);
    setEditModalOpen(true);
  };

  const handleDeleteBooth = (booth: BoothData) => {
    if (window.confirm(`Are you sure you want to delete booth: ${booth.booth_name}?`)) {
      alert(`Deleting booth: ${booth.booth_name}`);
    }
  };

  const handleSaveBooth = async (updatedBooth: Partial<BoothData>) => {
    try {
      setEditLoading(true);
      await boothController.updateBooth(updatedBooth.booth_id!, {
        category: updatedBooth.category!,
        status: updatedBooth.status!,
        sector: updatedBooth.sector!,
      });
      
      // Close modal first
      setEditModalOpen(false);
      setSelectedBooth(null);
      
      // Refresh the table data from server
      await loadBooths();
      
      alert('Booth updated successfully!');
    } catch (error) {
      alert(`Failed to update booth: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedBooth(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setViewBooth(null);
  };

  const handleClearFilters = () => {
    setSelectedSector('all');
    setSelectedStatus('all');
    setSelectedCategory('all');
  };

  const loadBooths = async () => {
    try {
      setLoading(true);
      setError(null);
      const boothData = await boothController.getAllBooths();
      setAllBooths(Array.isArray(boothData) ? boothData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booths');
      setAllBooths([]); 
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async () => {
    try {
      const sectorData = await boothController.getBoothSectors();   
      setSectors(Array.isArray(sectorData) ? sectorData : []);
    } catch (err) {
      setSectors([]); 
    }
  };

  const extractCategories = () => {
    const uniqueCategories = [...new Set(allBooths.map(booth => booth.category).filter(Boolean))];
    setCategories(uniqueCategories);
  };

  const applyFilters = () => {
    let currentBooths = [...allBooths];

    if (selectedSector !== 'all') {
      currentBooths = currentBooths.filter(booth => booth.sector === selectedSector);
    }

    if (selectedStatus !== 'all') {
      currentBooths = currentBooths.filter(booth => booth.status === selectedStatus);
    }

    if (selectedCategory !== 'all') {
      currentBooths = currentBooths.filter(booth => booth.category === selectedCategory);
    }

    setFilteredBooths(currentBooths);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { color: 'bg-green-100 text-green-800', label: 'Available' },
      reserved: { color: 'bg-yellow-100 text-yellow-800', label: 'Reserved' },
      booked: { color: 'bg-red-100 text-red-800', label: 'Booked' },
      pending: { color: 'bg-blue-100 text-blue-800', label: 'Pending' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('en-NG', {
  //     style: 'currency',
  //     currency: 'NGN',
  //     minimumFractionDigits: 0,
  //   }).format(price);
  // };

  const columns: TableColumn<BoothData>[] = [
    {
      name: 'Booth ID',
      selector: (row) => row.booth_id,
      sortable: true,
    },
    {
      name: 'Booth Name',
      selector: (row) => row.booth_name,
      sortable: true,
    },
    {
      name: 'Sector',
      selector: (row) => row.sector_description || row.sector || 'N/A',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => getStatusBadge(row.status),
    },
    {
      name: 'Size',
      selector: (row) => row.size,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
    },
    // {
    //   name: 'Price',
    //   selector: (row) => row.price,
    //   sortable: true,
    //   cell: (row) => formatPrice(row.price),
    // },
    {
      name: 'SQM',
      selector: (row) => row.sqm,
      sortable: true,
    },
    // {
    //   name: 'Booked By',
    //   selector: (row) => row.booked_by || 'N/A',
    //   sortable: true,
    // },
    {
      name: 'Book Date',
      selector: (row) => row.bookdate ? new Date(row.bookdate).getTime() : 0,
      sortable: true,
      cell: (row) => row.bookdate ? new Date(row.bookdate).toLocaleDateString() : 'N/A',
    },
    {
      name: 'Actions',
      selector: (row) => row.id,
      sortable: false,
      width: '120px',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewBooth(row)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="View Booth"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleEditBooth(row)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Edit Booth"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteBooth(row)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Delete Booth"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (loading && allBooths.length === 0) {
    return <LoadingOverlay isLoading={true} message="Loading booths..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booth Management</h1>
          <p className="text-gray-600">Manage and view all booth information</p>
        </div>
        
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex flex-wrap items-end gap-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">

          {/* Sector Filter */}
          <div className="flex flex-col">
            <label htmlFor="sector-filter" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
              Sector
            </label>
            <select
              id="sector-filter"
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="min-w-[120px] bg-white border border-gray-300 text-sm rounded-lg px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              {sectors.map((sector, idx) => (
                <option key={sector.id || idx} value={sector.name || ''}>
                  {sector.description || sector.name || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label htmlFor="status-filter" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-yellow-500" />
              Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="min-w-[120px] bg-white border border-gray-300 text-sm rounded-lg px-2 py-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="booked">Booked</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <label htmlFor="category-filter" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Tags className="w-3.5 h-3.5 text-green-500" />
              Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="min-w-[120px] bg-white border border-gray-300 text-sm rounded-lg px-2 py-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
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
        {(selectedSector !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all') && (
          <div className="flex gap-2 flex-wrap mt-3">
            {selectedSector !== 'all' && (
              <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center">
                Sector: {sectors.find(s => s.name === selectedSector)?.description || selectedSector}
                <button
                  className="ml-2 font-bold text-blue-400 hover:text-blue-600"
                  onClick={() => setSelectedSector('all')}
                  aria-label="Clear sector filter"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-xs flex items-center">
                Status: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                <button
                  className="ml-2 font-bold text-yellow-500 hover:text-yellow-700"
                  onClick={() => setSelectedStatus('all')}
                  aria-label="Clear status filter"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs flex items-center">
                Category: {selectedCategory}
                <button
                  className="ml-2 font-bold text-green-500 hover:text-green-700"
                  onClick={() => setSelectedCategory('all')}
                  aria-label="Clear category filter"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">T</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {selectedSector !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' ? 'Filtered' : 'Total'} Booths
              </p>
              <p className="text-2xl font-semibold text-gray-900">{filteredBooths.length}</p>
              {(selectedSector !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all') && (
                <p className="text-xs text-gray-500">of {allBooths.length} total</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">A</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredBooths.filter(b => b.status === 'available').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">R</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reserved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredBooths.filter(b => b.status === 'reserved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">B</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Booked</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredBooths.filter(b => b.status === 'booked').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        title="Booth Data"
        columns={columns}
        data={filteredBooths}
        loading={loading}
        pagination={true}
      />

      {/* Edit Booth Modal */}
      <EditBoothModal
        booth={selectedBooth}
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveBooth}
        loading={editLoading}
      />

      {/* View Booth Modal */}
      <ViewBoothModal
        booth={viewBooth}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default Booths; 