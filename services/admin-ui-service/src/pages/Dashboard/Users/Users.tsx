import { UserController } from "@/controllers/UserController";
import React, { useState, useEffect } from "react";
import { User, UserType } from "@/types/user.type";
import { FaTrash, FaEdit, FaEye, FaBan } from 'react-icons/fa';
import { TableColumn } from "react-data-table-component";
import LoadingPage from '../../../components/common/LoadingPage';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import SuccessDialog from '../../../components/common/SuccessDialog';
import ErrorDialog from '../../../components/common/ErrorDialog';
import DataTable from '../../../components/datatable/Datatable';
import UserTypeBadge from '../../../components/common/UserTypeBadge';
import StatusBadge from '../../../components/common/StatusBadge';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import ViewUser from './ViewUser';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ status: number; message: string } | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [dialogSuccessMessage, setDialogSuccessMessage] = useState('');
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Error deleting role');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
    const [showLoadingMessage, setShowLoadingMessage] = useState('');
    const [action, setAction] = useState<'delete' | 'disable' | 'active'>('delete');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await UserController.getInstance().getUsers();
                console.log(response);
                setUsers(response);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        setSelectedUserId(id);
        setAction('delete');
        setConfirmDialogMessage("Are you sure you want to delete this user?");
        setShowConfirmDialog(true);
    };

    const handleEdit = (id: number) => {
        const userToEdit = users.find(user => user.user_id === id);
        if (userToEdit) {
            setSelectedUser(userToEdit);
            setShowEditModal(true);
        }
    };

    const handleCreate = () => {
        setShowCreateModal(true);
    };

    const handleUserFormSuccess = () => {
        // Refresh the users list
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await UserController.getInstance().getUsers();
                setUsers(response);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    };

    const confirmAction = async () => {
        setShowConfirmDialog(false);
        setConfirmDialogMessage('');
        setDialogSuccessMessage('');
        if (selectedUserId) {
            try {
                if (action === 'delete') {
                    setShowLoadingMessage("Deleting user...");
                    setLoading(true);
                    await UserController.getInstance().deleteUser(selectedUserId);
                    setUsers(users.filter(user => user.user_id !== selectedUserId));
                    setDialogSuccessMessage("User deleted successfully");
                    setShowSuccessDialog(true);
                } else if (action === 'disable' || action === 'active') {
                    let UserStatus = 'active';
                    if (action === 'disable') {
                        setShowLoadingMessage("Disabling user...");
                        setDialogSuccessMessage("User disabled successfully");
                        UserStatus = 'inactive';
                    } else if (action === 'active') {
                        setShowLoadingMessage("Enabling user...");
                        setDialogSuccessMessage("User enabled successfully");
                    }
                    setLoading(true);
                    if (selectedUser?.userType === UserType.Exhibitor) {
                        await UserController.getInstance().updateUser({
                            user_id: selectedUserId,
                            status: UserStatus,
                            userType: selectedUser.userType,
                            email: selectedUser.email
                        });
                        setShowSuccessDialog(true);
                        setUsers(users.map(user => 
                            user.user_id === selectedUserId 
                                ? { ...user, status: UserStatus }
                                : user
                        ));
                    } else {
                        // Only exhibitor users can be disabled
                        setErrorMessage("Only exhibitor users can be disabled or enabled");
                        setShowErrorDialog(true);
                    }
                }
                setLoading(false);

            } catch (err: any) {
                setError(err);
            }
        }
        setSelectedUserId(null);
    };

    const handleDisable = async (id: number) => {
        const userToDisable = users.find(user => user.user_id === id);
        if (userToDisable) {
            setSelectedUser(userToDisable);
            setSelectedUserId(id);
            setAction('disable');
            setConfirmDialogMessage("Are you sure you want to disable this user?");
            setShowConfirmDialog(true);
        }
    };

    const handleEnable = async (id: number) => {
        const userToEnable = users.find(user => user.user_id === id);
        if (userToEnable) {
            setSelectedUser(userToEnable);
            setSelectedUserId(id);
            setAction('active');
            setConfirmDialogMessage("Are you sure you want to enable this user?");
            setShowConfirmDialog(true);
        }
    };

    const handleView = async (id: number) => {
        const userToEdit = users.find(user => user.user_id === id);
        if (userToEdit) {
            setSelectedUser(userToEdit);
            setShowViewModal(true);
        }
    };

    const columns: TableColumn<User>[] = [
        {
            name: 'Name',
            selector: (row) => row.first_name + ' ' + row.last_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
        },
        {
            name: "User Type",
            cell: (row) => <UserTypeBadge userType={row.user_type} />,
        },
        {
            name: "Status",
            cell: (row) => <StatusBadge isActive={!row.status || row.status === 'active'} />,
        },
        {
            name: "Verified",
            cell: (row) => <StatusBadge 
                isActive={row.verified} 
                activeLabel="Yes" 
                inactiveLabel="No" 
            />,
        },
        {
            name: "Company",
            selector: (row) => row.company || "N/A",
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleView(row.user_id)}
                        className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-800 shadow-sm transition duration-200 ring-1 ring-transparent hover:ring-green-300"
                        title="View"
                    >
                        <FaEye className="w-4 h-4" />
                    </button>

                    {row.status !== 'inactive' && (
                        <button
                            onClick={() => handleDisable(row.user_id)}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 shadow-sm transition duration-200 ring-1 ring-transparent hover:ring-red-300"
                            title="Disable"
                    >
                            <FaBan className="w-4 h-4" />
                        </button>
                    )}

                    {row.status === 'inactive' && (
                        <button
                            onClick={() => handleEnable(row.user_id)}
                            className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-800 shadow-sm transition duration-200 ring-1 ring-transparent hover:ring-green-300"
                            title="Enable"
                        >
                            <FaBan className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        onClick={() => handleEdit(row.user_id)}
                        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 shadow-sm transition duration-200 ring-1 ring-transparent hover:ring-blue-300"
                        title="Edit"
                    >
                        <FaEdit className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => handleDelete(row.user_id)}
                        className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 shadow-sm transition duration-200 ring-1 ring-transparent hover:ring-red-300"
                        title="Delete"
                    >
                        <FaTrash className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <LoadingPage 
            isLoading={loading} 
            error={error}
            loadingMessage={showLoadingMessage}
        >
            <ConfirmDialog
                isOpen={showConfirmDialog}
                message={confirmDialogMessage}
                onConfirm={confirmAction}
                onCancel={() => setShowConfirmDialog(false)}
            />
            <SuccessDialog
                isOpen={showSuccessDialog}
                message={dialogSuccessMessage}
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
            <CreateUser
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleUserFormSuccess}
            />
            {selectedUser && (
                <>
                    <EditUser
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                        }}
                        onSuccess={handleUserFormSuccess}
                        user={selectedUser}
                    />

                    <ViewUser
                        isOpen={showViewModal}
                        onClose={() => {
                            setShowViewModal(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                    />  
                </>
            )}
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <button 
                        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded shadow transition-colors"
                        onClick={handleCreate}
                    >
                        + Add New User
                    </button>
                </div>
                <DataTable<User>
                    title="User List"
                    columns={columns}
                    data={users}
                />
            </div>
        </LoadingPage>
    );
};

export default Users; 