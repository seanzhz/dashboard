import React, {Suspense} from 'react';
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

function ProtectedRoute({route, children}) {
    const {role, userInfo, loader} = useSelector(state => state.auth);

    if (loader) {
        return <div>Loading...</div>; // 等待 redux 拉完 userInfo
    }

    if (role === "admin") {
        return <Suspense fallback={null}>{children}</Suspense>;
    }

    if (role === "user") {
        // if (userInfo) {
        //     if (userInfo.role === route.role) {
        //         if (route.state) {
        //             if (route.status === userInfo.status) {
        //                 return <Suspense fallback={null}>{children}</Suspense>;
        //             } else {
        //                 return route.status === 'pending'
        //                     ? <Navigate to='/seller/account-pending1' replace />
        //                     : <Navigate to='/seller/account-pending2' replace />;
        //             }
        //         }
        //     } else {
        //         if (route.visibility?.some(status => status === userInfo.status)) {
        //             return <Suspense fallback={null}>{children}</Suspense>;
        //         } else {
        //             return <Navigate to='/seller/account-pending3' replace />;
        //         }
        //     }
        // } else {
        //     return <Navigate to="/unauthorized" replace />;
        // }
        console.log(userInfo)
        if (userInfo.role === route.role) {
        return <Suspense fallback={null}>{children}</Suspense>;}
        else {<Navigate to='/user/account-pending1' replace />}
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;
