import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from './components/Reuseable/Loader';
import { auth } from "./firebase/firebaseConfig";

function ProtectedRoute() {
    const [user, loading] = useAuthState(auth);
    const location = useLocation();

    if (loading) {
        return <div><Loader /></div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;
