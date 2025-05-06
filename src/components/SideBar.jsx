import React, { useEffect, useState } from 'react';
import {Link, Navigate, useLocation, useNavigate} from "react-router-dom";
import { getNav } from "../navigations";
import { CiLogout } from "react-icons/ci";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../store/Reducers/authReducer";

function SideBar({ showSideBar, setShowSideBar }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {role} = useSelector((state) => state.auth);
    const [allNav, setAllNav] = useState([
        {
            name: 'Dashboard',
            link: '/dashboard'
        }
    ]);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logout Success");
        navigate('/login')
    }

    const { pathname } = useLocation();

    useEffect(() => {
        const navs = getNav(role);
        setAllNav(navs);
    }, [role]);

    return (
        <div>
            <div
                onClick={() => setShowSideBar(false)}
                className={`fixed duration-200
                ${showSideBar ? 'visible' : 'invisible opacity-0'} w-screen h-screen 
                bg-theme-bg top-0 left-0 z-10`}>
            </div>

            <div className={`w-[260px] fixed bg-theme-bgSecondary h-screen z-50 top-0 transition-all ${
                showSideBar ? 'left-0' : 'left-[-260px] lg:left-0'
            }`}>
                <div className='h-[70px] flex items-center justify-center'>
                    <Link className='mt-3 w-[180px] h-[110px]' to='/'>
                        <img className={'w-full h-full'} src="http://localhost:3000/img/logo.png" alt='' />
                    </Link>
                </div>
                <div className="px-[16px] mt-3">
                    <ul>
                        {allNav.map((nav, index) => (
                            <li
                                key={index}
                                className={`px-[12px] py-[9px] flex justify-start items-center gap-[12px]
                                hover:bg-theme-card hover:rounded-md hover:pl-4 cursor-pointer w-full mb-2 transition-all
                                ${pathname === nav.path ? 'bg-theme-card rounded-md shadow-md font-bold text-theme-text' : ''}`}
                            >
                                <span className="text-theme-subtext">{nav.icon}</span>
                                <Link
                                    to={nav.path}
                                    className={`text-theme-subtext hover:text-theme-text 
                                    ${pathname === nav.path ? 'text-theme-text font-bold' : ''}`}
                                >
                                    {nav.title}
                                </Link>
                            </li>
                        ))}

                        <li
                            className={`px-[12px] py-[9px] flex justify-center items-center gap-[12px]
                            hover:bg-red-500 hover:text-white hover:pl-4 hover:rounded-md cursor-pointer w-full 
                            transition-all absolute bottom-0 left-0`} onClick={handleLogout}
                        >
                            <span className="text-theme-subtext">{<CiLogout />}</span>

                                <span className="text-theme-subtext hover:text-white">Logout</span>

                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SideBar;