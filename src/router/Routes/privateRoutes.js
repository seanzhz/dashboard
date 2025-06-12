import AdminDashboard from "../../views/admin/AdminDashboard";
import Home from "../../views/Home";
import Order from "../../views/admin/Order";
import Category from "../../views/admin/Category";
import Seller from "../../views/admin/Seller";
import PaymentRequest from "../../views/admin/PaymentRequest";
import DeactivateSeller from "../../views/admin/DeactivateSeller";
import SellerRequest from "../../views/admin/SellerRequest";
import SellerDetails from "../../views/admin/SellerDetails";
import SellerChat from "../../views/admin/SellerChat";
import OrderDetail from "../../views/admin/OrderDetail";
import AddProduct from "../../views/seller/AddProduct";
import Product from "../../views/seller/Product";
import ChatToCustomer from "../../views/seller/ChatToCustomer";
import ChatToAdmin from "../../views/seller/ChatToAdmin";
import Profile from "../../views/seller/Profile";
import EditProduct from "../../views/seller/EditProduct";
import ViewProduct from "../../views/seller/ViewProduct";
import Market from "../../views/seller/Market";
import ProductDetail from "../../views/seller/ProductDetail";

const adminRoutes = [
    {
        path: 'admin/dashboard',
        element:<AdminDashboard/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/order',
        element:<Order/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/categories',
        element:<Category/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/sellers',
        element:<Seller/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/payments',
        element:<PaymentRequest/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/deactivate-sellers',
        element:<DeactivateSeller/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/seller-request',
        element:<SellerRequest/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/seller/detail/:sellerId',
        element:<SellerDetails/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/seller-chat',
        element:<SellerChat/>,
        role: 'admin'
    },
    {
        path: 'admin/dashboard/order/detail/:orderId',
        element:<OrderDetail/>,
        role: 'admin'
    }
];

const userRoutes = [
    {
        path: '/',
        element:<Home/>,
        role: ['admin', 'user']
    },
    {
        path: '/products',
        element:<Product/>,
        role: 'user',
        status: 'active'
    },
    {
        path: '/add-product',
        element: <AddProduct/>,
        role: 'user',
        status: 'active'
    }
    ,
    {
        path: '/edit-product/:productId',
        element: <EditProduct/>,
        role: 'user',
        status: 'active'
    },
    {
        path: '/contact-customer',
        element: <ChatToCustomer/>,
        role: 'user',
        status: 'active'
    },
    {
        path: '/contact-admin',
        element: <ChatToAdmin/>,
        role: 'user',
        visibility: ['active','inactive','pending']
    },
    {
        path: '/profile',
        element: <Profile/>,
        role: 'user',
        status: 'active'
    },
    {
        path: "/products/:id",
        element: <ViewProduct/>,
        role: 'user',
        status: 'active'
    },
    {
        path: "/edit-product/:productId",
        element: <EditProduct/>,
        role: 'user',
        status: 'active'
    },
    {
        path: "/market",
        element: <Market/>,
        role: 'user',
    },
    {
        path: "/product/:id",
        element: <ProductDetail/>,
        role: 'user',
    },
    {
        path: "/contact-customer/:sellerId",
        element: <ChatToCustomer/>,
        role: 'user',
    }
]


export const privateRoutes = [...adminRoutes, ...userRoutes];