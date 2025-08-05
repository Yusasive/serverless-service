import { useUser } from '@/context/UserContext';
import NavigationHeader from '../../components/navigation/NavigationHeader';

export default function StaffDashboard() {;

    const {user, loading} = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    const isAuthenticated = !!user;

    return (
        <div>
            <NavigationHeader isAuthenticated={isAuthenticated} />
            <span>This is the Staff Dashboard</span>
        </div>
    )
}