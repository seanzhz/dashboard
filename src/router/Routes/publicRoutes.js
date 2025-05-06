import {lazy} from "react";

import Register from "../../views/auth/Register";
import AdminLogin from "../../views/auth/AdminLogin";
import Home from "../../views/Home";
import Unauth from "../../views/Unauth";
const Login = lazy(()=>import ( "../../views/auth/Login"));


const publicRoutes = [
    {
        path: '/login',
        element:<Login/>
    },
    {
        path: '/register',
        element: <Register/>
    },
    {
        path: '/admin/login',
        element: <AdminLogin/>
    },
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/unauthorized',
        element: <Unauth/>
    }

]

export default publicRoutes;