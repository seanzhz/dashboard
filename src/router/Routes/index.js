import {privateRoutes} from "./privateRoutes";
import MainLayout from "../../components/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

export const getPrivateRoutes = () => {

    privateRoutes.map( route => {
        route.element = <ProtectedRoute route={route}>{route.element}</ProtectedRoute>
    })

    return {
        path:'/',
        element:<MainLayout/>,
        children:privateRoutes,
    };
}