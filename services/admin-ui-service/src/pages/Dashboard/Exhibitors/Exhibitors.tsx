import React, { useState, useEffect } from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTable from '@/components/datatable/Datatable';
import { ExhibitorController } from '@/controllers/ExhibitorController';
import { BoothController } from '@/controllers/BoothController';
import { ExhibitorData, ExhibitorStats } from '@/types/exhibitor.type';
import { BoothSector } from '@/types/booth.type';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Badge from '@/components/ui/Badge';
import { Building2, Users, Shield, MapPin, Download } from 'lucide-react';
import ViewExhibitorModal from '@/components/modals/ViewExhibitorModal';

const Exhibitors: React.FC = () => {
  const [allExhibitors, setAllExhibitors] = useState<ExhibitorData[]>([]);
  const [filteredExhibitors, setFilteredExhibitors] = useState<ExhibitorData[]>([]);
  const [stats, setStats] = useState<ExhibitorStats>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    with_booths: 0,
    without_booths: 0,
  });
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchCompany, setSearchCompany] = useState<string>('');
  const [sectors, setSectors] = useState<BoothSector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<ExhibitorData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const exhibitorController = ExhibitorController.getInstance();
  const boothController = new BoothController();

  useEffect(() => {
    loadExhibitors();
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    applyFilters();
  }, [allExhibitors, selectedVerification, selectedSector, searchCompany]);

  // Add a retry mechanism for authentication errors
  const handleRetry = () => {
    setError(null);
    loadExhibitors();
  };

  const loadExhibitors = async () => {
    try {
      setLoading(true);
      setError(null);
      const exhibitorData = await exhibitorController.getAllExhibitors();
      setAllExhibitors(Array.isArray(exhibitorData) ? exhibitorData : []);
      
      // Load stats
      const statsData = await exhibitorController.getExhibitorStats();
      setStats(statsData);
      
      // Load sectors
      const sectorData = await boothController.getBoothSectors();
      setSectors(Array.isArray(sectorData) ? sectorData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exhibitors');
      setAllExhibitors([]); 
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let currentExhibitors = [...allExhibitors];

    if (selectedVerification !== 'all') {
      const isVerified = selectedVerification === 'verified';
      currentExhibitors = currentExhibitors.filter(exhibitor => exhibitor.verified === isVerified);
    }

    if (selectedSector !== 'all') {
      currentExhibitors = currentExhibitors.filter(exhibitor => exhibitor.booth_type === selectedSector);
    }

    if (searchCompany.trim()) {
      currentExhibitors = currentExhibitors.filter(exhibitor => 
        exhibitor.company?.toLowerCase().includes(searchCompany.toLowerCase())
      );
    }

    setFilteredExhibitors(currentExhibitors);
  };

  const handleClearFilters = () => {
    setSelectedVerification('all');
    setSelectedSector('all');
    setSearchCompany('');
  };

  const getVerificationBadge = (verified: boolean) => {
    return (
      <Badge className={verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {verified ? 'Verified' : 'Unverified'}
      </Badge>
    );
  };

  const getActiveStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const columns: TableColumn<ExhibitorData>[] = [
    {
      name: 'ID',
      selector: (row) => row.user_id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name',
      selector: (row) => row.full_name || 'N/A',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.full_name || 'N/A'}</span>
        </div>
      ),
    },
    {
      name: 'Company',
      selector: (row) => row.company || 'N/A',
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.company || 'N/A'}</span>
          <span className="text-sm text-gray-500">{row.local || 'N/A'}</span>
        </div>
      ),
    },
    {
      name: 'Contact',
      selector: (row) => row.phone,
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">{row.phone}</span>
          <span className="text-xs text-gray-500">{row.email}</span>
        </div>
      ),
    },
    {
      name: 'Verification',
      selector: (row) => row.verified,
      sortable: true,
      cell: (row) => getVerificationBadge(row.verified),
    },
    {
      name: 'Account',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => getActiveStatusBadge(row.is_active),
    },
    {
      name: 'Sector',
      selector: (row) => row.booth_type || 'N/A',
      sortable: true,
    },
    {
      name: 'Rating',
      selector: (row) => row.rating || 0,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <span className="text-sm font-medium">{row.rating || 'N/A'}</span>
          {row.rating && (
            <div className="flex ml-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < (row.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      name: 'Actions',
      selector: (row) => row.user_id,
      sortable: false,
      width: '120px',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewExhibitor(row)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="View Exhibitor"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleEditExhibitor(row)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Edit Exhibitor"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteExhibitor(row)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Delete Exhibitor"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const handleViewExhibitor = (exhibitor: ExhibitorData) => {
    setSelectedExhibitor(exhibitor);
    setIsViewModalOpen(true);
  };

  const handleEditExhibitor = (exhibitor: ExhibitorData) => {
    alert(`Editing exhibitor: ${exhibitor.full_name}`);
  };

  const handleDeleteExhibitor = (exhibitor: ExhibitorData) => {
    if (window.confirm(`Are you sure you want to delete exhibitor: ${exhibitor.full_name}?`)) {
      alert(`Deleting exhibitor: ${exhibitor.full_name}`);
    }
  };

  const handleExportExhibitors = async () => {
    try {
      setExportLoading(true);
      const result = await exhibitorController.exportExhibitors();
      
      if (result.success && result.downloadUrl) {
        // The downloadUrl is already a complete signed S3/CloudFront URL
        const fullDownloadUrl = result.downloadUrl;
        
        try {
          // Extract filename from the URL path
          const urlPath = fullDownloadUrl.split('?')[0];
          const filename = urlPath.split('/').pop() || 'exhibitors_export.csv';
          
          // Create a temporary anchor element to trigger download
          const link = document.createElement('a');
          link.href = fullDownloadUrl;
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
        } catch (downloadError) {
          console.error('Download failed:', downloadError);
          alert('Download failed. Please try again.');
        }
      } else {
        alert(result.error || 'Export failed');
      }
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading && allExhibitors.length === 0) {
    return <LoadingOverlay isLoading={true} message="Loading exhibitors..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exhibitor Management</h1>
          <p className="text-gray-600">Manage and view all exhibitor information</p>
        </div>
        <button
          onClick={handleExportExhibitors}
          disabled={exportLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          {exportLoading ? 'Exporting (this may take a few minutes)...' : 'Export Exhibitors'}
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex flex-wrap items-end gap-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm">

          {/* Company Search */}
          <div className="flex flex-col">
            <label htmlFor="company-search" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              Company
            </label>
            <input
              id="company-search"
              type="text"
              placeholder="Search company..."
              value={searchCompany}
              onChange={e => setSearchCompany(e.target.value)}
              className="min-w-[200px] bg-white border border-gray-300 text-sm rounded-lg px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Verification Filter */}
          <div className="flex flex-col">
            <label htmlFor="verification-filter" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              Verification
            </label>
            <select
              id="verification-filter"
              value={selectedVerification}
              onChange={e => setSelectedVerification(e.target.value)}
              className="min-w-[120px] bg-white border border-gray-300 text-sm rounded-lg px-2 py-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="flex flex-col">
            <label htmlFor="sector-filter" className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-500" />
              Sector
            </label>
            <select
              id="sector-filter"
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="min-w-[120px] bg-white border border-gray-300 text-sm rounded-lg px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All</option>
              {sectors
                .filter(sector => {
                  const description = sector.description || sector.name || '';
                  return !description.toLowerCase().includes('hall');
                })
                .map((sector, idx) => (
                  <option key={sector.id || idx} value={sector.description || ''}>
                    {sector.description || sector.name || 'Unknown'}
                  </option>
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
        {(selectedVerification !== 'all' || selectedSector !== 'all' || searchCompany) && (
          <div className="flex gap-2 flex-wrap mt-3">
            {searchCompany && (
              <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center">
                Company: {searchCompany}
                <button
                  className="ml-2 font-bold text-blue-400 hover:text-blue-600"
                  onClick={() => setSearchCompany('')}
                  aria-label="Clear company filter"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedVerification !== 'all' && (
              <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs flex items-center">
                Verification: {selectedVerification.charAt(0).toUpperCase() + selectedVerification.slice(1)}
                <button
                  className="ml-2 font-bold text-green-500 hover:text-green-700"
                  onClick={() => setSelectedVerification('all')}
                  aria-label="Clear verification filter"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedSector !== 'all' && (
              <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs flex items-center">
                Sector: {selectedSector}
                <button
                  className="ml-2 font-bold text-purple-500 hover:text-purple-700"
                  onClick={() => setSelectedSector('all')}
                  aria-label="Clear sector filter"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                {selectedVerification !== 'all' || selectedSector !== 'all' || searchCompany ? 'Filtered' : 'Total'} Exhibitors
              </p>
              <p className="text-2xl font-semibold text-gray-900">{filteredExhibitors.length}</p>
              {(selectedVerification !== 'all' || selectedSector !== 'all' || searchCompany) && (
                <p className="text-xs text-gray-500">of {stats.total} total</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.verified}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        title="Exhibitor Data"
        columns={columns}
        data={filteredExhibitors}
        loading={loading}
        pagination={true}
      />

      {/* View Exhibitor Modal */}
      <ViewExhibitorModal
        exhibitor={selectedExhibitor}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedExhibitor(null);
        }}
      />
    </div>
  );
};

export default Exhibitors;
