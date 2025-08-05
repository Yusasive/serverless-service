import React, { useState, useEffect } from 'react';
import { Role } from '../../../types/role.type';
import { TableColumn } from 'react-data-table-component';
import DataTable from '../../../components/datatable/Datatable';
import { RoleController } from '../../../controllers/RoleController';
import LoadingPage from '../../../components/common/LoadingPage';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SuccessDialog from '@/components/common/SuccessDialog';
import ErrorDialog from '@/components/common/ErrorDialog';

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ status: number; message: string } | null>(null);
    const navigate = useNavigate();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Error deleting role');

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            setError(null);
            try {
                const roles = await RoleController.getInstance().getRoles();
                setRoles(roles);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);


    const handleDelete = async (id: number) => {
        setSelectedRoleId(id);
        setShowConfirmDialog(true);
    };

    const handleEdit = (id: number) => {
        navigate(`/dashboard/roles/edit/${id}`);
    };

    const confirmDelete = async () => {
        setShowConfirmDialog(false);
        if (selectedRoleId) {
            if (roles.find(role => role.id === selectedRoleId)?.created_by?.toLowerCase() === 'system') {
                setErrorMessage('Cannot delete system role');
                setShowErrorDialog(true);
                return;
            }
            try {
                await RoleController.getInstance().deleteRole(selectedRoleId);
                setShowSuccessDialog(true);
                setRoles(roles.filter(role => role.id !== selectedRoleId));
            } catch (err: any) {
                setError(err);
            }
        }
        setSelectedRoleId(null);
    };
    

    const columns: TableColumn<Role>[] = [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row) => row.description,
        },
        {
            name: 'Permissions',
            cell: (row) =>
                row.rolePermissions.length > 3 ? (
                    <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                        {row.rolePermissions.length} permissions
                    </span>
                ) : (
                    <div className="flex flex-wrap gap-1">
                        {row.rolePermissions.map((rp) => (
                        <span
                            key={rp.id}
                            className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                        >
                            {rp.permission.name}
                        </span>
                        ))}
                    </div>
                ),
        },
        {
            name: 'Created By',
            cell: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-gray-800">
                    {row.created_by}
                </span>
            ),
        },
        {
            name: 'Created',
            selector: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row.id)}
                        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 shadow-sm transition duration-200 ring-1 ring-transparent hover:ring-blue-300"
                        title="Edit"
                    >
                        <FaEdit className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 shadow-sm transition duration-200 ring-1 ring-transparent hover:ring-red-300"
                        title="Delete"
                    >
                        <FaTrash className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <LoadingPage 
            isLoading={loading} 
            error={error}
            loadingMessage="Loading roles..."
        >
            <ConfirmDialog
                isOpen={showConfirmDialog}
                message="Are you sure you want to delete this role?"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirmDialog(false)}
            />
            <SuccessDialog
                isOpen={showSuccessDialog}
                message="Role deleted successfully"
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
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
                    <button 
                        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded shadow transition-colors"
                        onClick={() => {
                            navigate('/dashboard/roles/create');
                        }}
                    >
                        + Add New Role
                    </button>
                </div>
                <DataTable<Role>
                    title="Role List"
                    columns={columns}
                    data={roles}
                />
            </div>
        </LoadingPage>
    );
};

export default Roles; 