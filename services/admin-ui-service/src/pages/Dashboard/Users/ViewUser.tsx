import React from 'react';
import { User, UserType } from '@/types/user.type';
import Modal from '@/components/common/Modal';

interface ViewUserProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User;
}

const InfoRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <p className="mt-1 text-sm text-gray-900">{value ?? 'N/A'}</p>
    </div>
);

const ViewUser: React.FC<ViewUserProps> = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    const renderUserTypeSpecificFields = () => {
        switch (user.userType) {
            case UserType.Exhibitor:
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <InfoRow label="Company" value={user.company} />
                        <InfoRow label="Rating" value={user.rating} />
                        <InfoRow label="Status" value={user.status} />
                        <InfoRow
                            label="Location"
                            value={user.lat && user.lng ? `${user.lat}, ${user.lng}` : 'N/A'}
                        />
                    </div>
                );
            case UserType.Organizer:
            case UserType.Organizer_Staff:
            case UserType.Super_Admin:
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <InfoRow label="Ticket Number" value={user.ticket_number} />
                        <InfoRow label="Staff ID" value={user.staff_id} />
                        <InfoRow label="QR Code" value={user.qr_code} />
                        <InfoRow label="Download" value={user.download} />
                    </div>
                );
            default:
                return <p className="text-sm text-gray-500">No additional information for this user.</p>;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`User Details — ${user.first_name} ${user.last_name}`}
        >
            <div className="space-y-8">

                {/* Section: Basic Information */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Phone" value={user.phone} />
                        <InfoRow label="User Type" value={user.userType} />
                        <InfoRow label="Status" value={user.is_active ? 'Active' : 'Inactive'} />
                        <InfoRow label="Verified" value={user.verified ? 'Yes' : 'No'} />
                    </div>
                </section>

                {/* Section: Address Information */}
                {user.address && user.address.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {user.address.map((addr) => (
                                <div key={addr.id} className="border rounded-lg p-3 bg-gray-50">
                                    <p className="text-sm text-gray-800">{addr.address_line1}</p>
                                    {addr.address_line2 && (
                                        <p className="text-sm text-gray-800">{addr.address_line2}</p>
                                    )}
                                    <p className="text-sm text-gray-800">
                                        {addr.city}, {addr.state} — {addr.country}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Section: Type Specific Information */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Additional Information</h3>
                    {renderUserTypeSpecificFields()}
                </section>
            </div>
        </Modal>
    );
};

export default ViewUser;
