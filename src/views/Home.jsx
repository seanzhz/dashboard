import React from 'react';
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Home component
 * This component handles the default route redirection based on user role.
 *
 * - If the user is a 'user', redirect to the market page.
 * - If the user is an 'admin', redirect to the admin dashboard.
 * - If no role (or unknown role), redirect to the login page.
 */
function Home() {
    // Get user role from Redux store (auth slice)
    const { role } = useSelector(state => state.auth);

    // Redirect logic based on role
    if (role === 'user') {
        return <Navigate to="/market" replace />;
    } else if (role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    } else {
        // For unauthenticated or unknown role, redirect to login page
        return <Navigate to="/login" replace />;
    }
}

export default Home;