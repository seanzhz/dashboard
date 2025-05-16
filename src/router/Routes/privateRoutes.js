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
import SellerDashboard from "../../views/seller/SellerDashboard";
import AddProduct from "../../views/seller/AddProduct";
import Product from "../../views/seller/Product";
import DiscountProduct from "../../views/seller/DiscountProduct";
import Orders from "../../views/seller/Orders";
import Payments from "../../views/seller/Payments";
import ChatToCustomer from "../../views/seller/ChatToCustomer";
import ChatToAdmin from "../../views/seller/ChatToAdmin";
import Profile from "../../views/seller/Profile";
import EditProduct from "../../views/seller/EditProduct";
import OrderDetail_Seller from "../../views/seller/OrderDetail-Seller";
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

const sellerRoutes = [
    {
        path: '/',
        element:<Home/>,
        role: ['admin', 'seller']
    },
    {
        path: '/seller/dashboard',
        element:<SellerDashboard/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/products',
        element:<Product/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/add-product',
        element: <AddProduct/>,
        role: 'seller',
        status: 'active'
    }
    ,
    {
        path: '/seller/dashboard/edit-product/:productId',
        element: <EditProduct/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/product-discount',
        element: <DiscountProduct/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/orders',
        element: <Orders/>,
        role: 'seller',
        visibility: ['active','inactive']
    },
    {
        path: '/seller/dashboard/orders/:orderId',
        element: <OrderDetail_Seller/>,
        role: 'seller',
        visibility: ['active','inactive']
    },
    {
        path: '/seller/dashboard/payments',
        element: <Payments/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/contact-customer',
        element: <ChatToCustomer/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: '/seller/dashboard/contact-admin',
        element: <ChatToAdmin/>,
        role: 'seller',
        visibility: ['active','inactive','pending']
    },
    {
        path: '/seller/dashboard/profile',
        element: <Profile/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/products/:id",
        element: <ViewProduct/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/edit-product/:productId",
        element: <EditProduct/>,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/market",
        element: <Market/>,
        role: 'seller',
    },
    {
        path: "/seller/product/:id",
        element: <ProductDetail/>,
        role: 'seller',
    },
    {
        path: "/seller/dashboard/contact-customer/:sellerId",
        element: <ChatToCustomer/>,
        role: 'seller',
    }
]


export const privateRoutes = [...adminRoutes, ...sellerRoutes];