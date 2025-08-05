interface ComingSoonProps {
    title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title} - Coming Soon</h2>
            <p className="text-gray-600">This section is under development. Please check back later!</p>
        </div>
    );
} 