import React, { useState, useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import { FaTrash, FaEdit, FaQrcode, FaPlus } from 'react-icons/fa';
import { X } from 'lucide-react';
import { UserController } from "@/controllers/UserController";
import { CompanyRep } from "@/types/companyRep.types";
import DataTable from "@/components/datatable/Datatable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SuccessDialog from "@/components/common/SuccessDialog";
import ErrorDialog from "@/components/common/ErrorDialog";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import QRCodePopup from "@/components/common/QRCodePopup";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/common/ImageUpload";

interface CompanyRepFormData {
    company_name: string;
    name: string;
    phone: string;
    email: string;
    photo: string;
}

export default function CompanyRepresentative() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [companyRepresentatives, setCompanyRepresentatives] = useState<CompanyRep[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showQRPopup, setShowQRPopup] = useState(false);
    const [selectedRep, setSelectedRep] = useState<CompanyRep | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState<CompanyRepFormData>({
        company_name: user?.company || '',
        name: '',
        phone: '',
        email: '',
        photo: ''
    });

    useEffect(() => {
        fetchCompanyReps();
    }, []);

    const fetchCompanyReps = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await UserController.getInstance().getCompanyReps();
            if (response.success && response.data) {
                setCompanyRepresentatives(response.data);
            } else {
                setError(response.error || 'Failed to fetch company representatives');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setFormData({
            company_name: user?.company || '',
            name: '',
            phone: '',
            email: '',
            photo: '',
        });
        setShowAddDialog(true);
    };

    const handleEdit = (rep: CompanyRep) => {
        setSelectedRep(rep);
        setFormData({
            company_name: rep.company_name,
            name: rep.name,
            phone: rep.phone || '',
            email: rep.email || '',
            photo: rep.photo || ''
        });
        setShowEditDialog(true);
    };

    const handleDelete = (rep: CompanyRep) => {
        setSelectedRep(rep);
        setShowDeleteDialog(true);
    };

    const handleGenerateQR = async (rep: CompanyRep) => {
        setSelectedRep(rep);
        setShowQRPopup(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!user) {
            setErrorMessage('Session expired');
            navigate('/login');
            return;
        }
        
        try {
            if (showAddDialog) {
                const response = await UserController.getInstance().addCompanyRep({
                    ...formData,
                    exhibitor_id: user._id, // This should come from the current user context
                    qrcode: '',
                });
                
                if (response.success) {
                    setSuccessMessage('Company representative added successfully');
                    setShowSuccessDialog(true);
                    setShowAddDialog(false);
                    fetchCompanyReps();
                } else {
                    setErrorMessage(response.error || 'Failed to add company representative');
                    setShowErrorDialog(true);
                }
            } else if (showEditDialog && selectedRep?.id) {
                const response = await UserController.getInstance().updateCompanyRep(selectedRep.id, formData);
                
                if (response.success) {
                    setSuccessMessage('Company representative updated successfully');
                    setShowSuccessDialog(true);
                    setShowEditDialog(false);
                    setSelectedRep(null);
                    fetchCompanyReps();
                } else {
                    setErrorMessage(response.error || 'Failed to update company representative');
                    setShowErrorDialog(true);
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An error occurred');
            setShowErrorDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedRep?.id) return;
        
        setLoading(true);
        try {
            const response = await UserController.getInstance().deleteCompanyRep(selectedRep.id);
            
            if (response.success) {
                setSuccessMessage('Company representative deleted successfully');
                setShowSuccessDialog(true);
                setShowDeleteDialog(false);
                setSelectedRep(null);
                fetchCompanyReps();
            } else {
                setErrorMessage(response.error || 'Failed to delete company representative');
                setShowErrorDialog(true);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An error occurred');
            setShowErrorDialog(true);
        } finally {
            setLoading(false);
        }
    };

    const columns: TableColumn<CompanyRep>[] = [
        {
            name: 'Name',
            selector: (row: CompanyRep) => row.name,
            sortable: true,
        },
        {
            name: 'Company',
            selector: (row: CompanyRep) => row.company_name,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: (row: CompanyRep) => row.phone || 'N/A',
        },
        {
            name: 'Email',
            selector: (row: CompanyRep) => row.email || 'N/A',
        },    
        {
            name: 'Actions',
            cell: (row: CompanyRep) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleGenerateQR(row)}
                        className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-800 shadow-sm transition duration-200"
                        title="Generate QR Code"
                    >
                        <FaQrcode className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 shadow-sm transition duration-200"
                        title="Edit"
                    >
                        <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 shadow-sm transition duration-200"
                        title="Delete"
                    >
                        <FaTrash className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    const renderDialog = () => {
        if (showAddDialog || showEditDialog) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <LoadingOverlay isLoading={loading} message={showAddDialog ? "Adding..." : "Updating..."} />
                        
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {showAddDialog ? 'Add New Company Representative' : 'Edit Company Representative'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddDialog(false);
                                    setShowEditDialog(false);
                                    setSelectedRep(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="company_name"
                                        required
                                        readOnly
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm bg-gray-50 text-gray-700 cursor-not-allowed"
                                        value={formData.company_name}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Representative Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                                        Photo
                                    </label>
                                    <ImageUpload
                                        value={formData.photo}
                                        onChange={(url) => setFormData({ ...formData, photo: url })}
                                        folder="company-reps"
                                        placeholder="Upload representative photo"
                                        aspectRatio="square"
                                        className="w-32 h-32"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddDialog(false);
                                        setShowEditDialog(false);
                                        setSelectedRep(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {showAddDialog ? 'Add Representative' : 'Update Representative'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Company Representatives</h1>
                <button 
                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors flex items-center gap-2"
                    onClick={handleAdd}
                >
                    <FaPlus className="w-4 h-4" />
                    Add Representative
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <DataTable<CompanyRep>
                title="Company Representatives"
                columns={columns}
                data={companyRepresentatives}
                loading={loading}
            />

            {/* Dialogs */}
            {renderDialog()}

            {/* QR Code Popup */}
            <QRCodePopup
                isOpen={showQRPopup}
                onClose={() => {
                    setShowQRPopup(false);
                    setSelectedRep(null);
                }}
                data={selectedRep}
                title={`${selectedRep?.name} - QR Code`}
                size={250}
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                message="Are you sure you want to delete this company representative? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    setSelectedRep(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
            />

            <SuccessDialog
                isOpen={showSuccessDialog}
                message={successMessage}
                onRedirect={() => setShowSuccessDialog(false)}
                buttonText="Continue"
                showButton={true}
            />

            <ErrorDialog
                isOpen={showErrorDialog}
                message={errorMessage}
                onClose={() => setShowErrorDialog(false)}
                buttonText="Continue"
                showButton={true}
            />
        </div>
    );
}