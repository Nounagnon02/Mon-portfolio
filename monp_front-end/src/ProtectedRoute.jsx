import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authData } = useAuth();
    const location = useLocation();

    if (!authData?.user) {
        return <Navigate to="/dashboard-admin" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(authData.user.role)) {
        // Rediriger vers une page "non autorisé" ou la page par défaut selon le rôle
        const defaultRoute = 
            authData.user.role === 'admin'
            ?'/dashboard-admin'
            :'/'; 

        return <Navigate to={defaultRoute} replace />;
    }

    return children;
};

export default ProtectedRoute;