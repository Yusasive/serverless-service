import { User } from '../../../types/user.type';

interface AboutSectionProps {
    user: User;
}

export default function AboutSection({ user }: AboutSectionProps) {
    const sections = [
        {
            title: 'Personal Information',
            fields: [
                { label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || 'Not specified' },
                { label: 'User Type', value: user.userType },
            ]
        },
        {
            title: 'Location',
            fields: [
                { label: 'City', value: user.address?.find(addr => addr.is_primary)?.city || 'Not specified' },
                { label: 'Country', value: user.address?.find(addr => addr.is_primary)?.country || 'Not specified' },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            {sections.map((section) => (
                <div key={section.title} className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.fields.map((field) => (
                            <div key={field.label} className="space-y-1">
                                <p className="text-sm text-gray-500">{field.label}</p>
                                <p className="text-sm font-medium text-gray-900">{field.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
} 