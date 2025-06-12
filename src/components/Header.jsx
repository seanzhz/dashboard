import React from 'react';
import { FaList } from "react-icons/fa6";
import {useSelector} from "react-redux";

function Header({ showSideBar, setShowSideBar }) {
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <div className="top-0 left-0 w-full py-5 px-2 lg:px-7 z-40 static">
            <div className="ml-0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-[#c4d9ee] px-5 transition-all">

                <div
                    onClick={() => setShowSideBar(!showSideBar)}
                    className="w-[35px] flex lg:hidden h-[35px] rounded-sm
               shadow-lg bg-theme-border justify-center items-center cursor-pointer hover:bg-theme-hover"
                >
                    <span><FaList className="text-theme-text" /></span>
                </div>

                <div className="hidden md:block">

                </div>

                <div className="flex items-center justify-center gap-5 relative">
                    <div className="flex items-center justify-center gap-3">
                        <h1 className="text-lg font-bold text-theme-text">{userInfo? userInfo.username : 'Default'}</h1>
                    </div>
                    <img
                        src={userInfo.image? userInfo.image : null}
                        alt="user"
                        className="w-[40px] h-[40px] rounded-full overflow-hidden border border-theme-border"
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;