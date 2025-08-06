import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute() {
    const location = useLocation();
    const token = localStorage.getItem('admintoken');

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;
