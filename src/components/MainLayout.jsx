import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

function MainLayout(props) {
    const [showSideBar, setShowSideBar] = useState(false);

    return (
        <div className='bg-theme-bg w-full min-h-screen'>
            <Header showSideBar={showSideBar} setShowSideBar={setShowSideBar}/>
            <SideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar}/>
            <div className='ml-0 lg:ml-[260px] transition-all'>
            <Outlet/>
            </div>
        </div>
    );
}

export default MainLayout;