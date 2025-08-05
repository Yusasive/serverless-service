interface ProfileNavigationProps {
    userType: 'attendee' | 'exhibitor';
    onTabChange: (tab: string) => void;
    activeTab: string;
}

export default function ProfileNavigation({ onTabChange, activeTab }: ProfileNavigationProps) {
    const tabs = [
        { id: 'about', name: 'About' },
        { id: 'edit', name: 'Edit Profile' },
        { id: 'settings', name: 'Account Settings' },
    ];

    return (
        <div className="flex flex-wrap gap-3 border-t mt-8 pt-6 text-sm font-medium">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            isActive
                                ? 'text-white bg-green-600 hover:bg-green-700'
                                : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.name}
                    </button>
                );
            })}
        </div>
    );
} 