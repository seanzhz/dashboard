import {MdSpaceDashboard} from "react-icons/md";
import {FaRegCreditCard, FaUser, FaUsersSlash} from "react-icons/fa";
import {BiSolidCategory, BiUserVoice, BiSolidContact} from "react-icons/bi";
import {IoChatbubblesSharp} from "react-icons/io5";
import {RiCustomerService2Fill} from "react-icons/ri";
import {FaCartShopping} from "react-icons/fa6";
import {ImProfile} from "react-icons/im";
import {FiShoppingBag} from "react-icons/fi";
import {TbHorseToy} from "react-icons/tb";

export const allNav = [
    {
    id:1,
    title:'Dashboard',
    icon: <MdSpaceDashboard />,
        role:'admin',
        path:'/admin/dashboard'
},
    {
        id:2,
        title:'Orders',
        icon: <FaCartShopping />,
        role:'admin',
        path:'/admin/dashboard/order'
    },
    {
        id:3,
        title:'Categories',
        icon: <BiSolidCategory />,
        role: 'admin',
        path:'/admin/dashboard/categories'
    },
    {
        id:4,
        title:'Seller',
        icon: <FaUser />,
        role: 'admin',
        path:'/admin/dashboard/sellers'
    },
    {
        id:5,
        title:'Payments',
        icon: <FaRegCreditCard />,
        role: 'admin',
        path:'/admin/dashboard/payments'
    },
    {
        id:6,
        title:'Deactivate Sellers',
        icon: <FaUsersSlash />,
        role: 'admin',
        path:'/admin/dashboard/deactivate-sellers'
    },
    {
        id:7,
        title:'Seller Request',
        icon: <BiUserVoice />,
        role: 'admin',
        path:'/admin/dashboard/seller-request'
    },
    {
        id:8,
        title:'Chat',
        icon: <IoChatbubblesSharp />,
        role: 'admin',
        path:'/admin/dashboard/seller-chat'
    },
    // {
    //     id: 9,
    //     title: 'Dashboard',
    //     icon: <MdSpaceDashboard />,
    //     role: 'seller',
    //     path: '/seller/dashboard'
    // },
    {
        id: 9,
        title: 'Market place',
        icon: <FiShoppingBag />,
        role: 'seller',
        path: '/seller/dashboard/market'
    },

    {
        id: 10,
        title: 'My Post',
        icon: <TbHorseToy />,
        role: 'seller',
        path: '/seller/dashboard/products'
    },
    {
        id: 11,
        title: 'Contact Customer',
        icon: <RiCustomerService2Fill />,
        role: 'seller',
        path: '/seller/dashboard/contact-customer'
    },
    {
        id: 12,
        title: 'Contact Admin',
        icon: <BiSolidContact />,
        role: 'seller',
        path: '/seller/dashboard/contact-admin'
    },
    {
        id: 13,
        title: 'Profile',
        icon: <ImProfile />,
        role: 'seller',
        path: '/seller/dashboard/profile'
    }
];