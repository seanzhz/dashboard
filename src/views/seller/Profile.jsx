import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../store/Reducers/authReducer";


function Profile() {

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);

    // 用户信息部分状态（只包含只读信息和可编辑信息）
    const [profile, setProfile] = useState({
        userId: '',         // 只读信息
        status: '',           // 只读信息
        role: '',              // 只读信息
        image: '',             // 预览 URL（前端展示）
        imageFile: null,
        username: '',           // 可编辑信息：姓名
        contact: ""     // 可编辑信息：店铺名称
    });

    // 账号设置部分状态
    const [account, setAccount] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (userInfo) {
            setProfile({
                userId: userInfo._id,         // 只读信息
                status: userInfo.status,           // 只读信息
                role: userInfo.role,              // 只读信息
                image: userInfo.image, // 可编辑信息：头像
                username: userInfo.username,           // 可编辑信息：姓名
                contact: userInfo.contact     // 可编辑信息：店铺名称
            })
            setAccount({
                ...account,
                email: userInfo.email,
            })
        }
    }, [userInfo]);


    // 处理用户信息（头像、姓名、店铺名称）的改变
    const handleProfileChange = (e) => {
        const {name, value, files} = e.target;

        if (name === 'image' && files && files[0]) {
            const file = files[0];
            setProfile(prev => ({
                ...prev,
                imageFile: file,                         // 给后端用
                image: URL.createObjectURL(file)         // 给前端预览用
            }));
        } else {
            setProfile(prev => ({...prev, [name]: value}));
        }
    };

    // 用户信息更新提交处理
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('username', profile.username);
        formData.append('contact', profile.contact);

        if (profile.imageFile) {
            formData.append('image', profile.imageFile);  // 🟢 变量名必须叫 image，和后端一致
        }

        // Debug 打印
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        dispatch(updateUser({id: userInfo._id, formData}))
    };


    // 处理账号设置（邮箱、密码）的改变
    const handleAccountChange = (e) => {
        const {name, value} = e.target;
        setAccount(prev => ({...prev, [name]: value}));
    };

    // 账号设置更新提交处理
    const handleAccountUpdate = (e) => {
        e.preventDefault();
        if (account.newPassword !== account.confirmPassword) {
            alert('New password and confirmation do not match!');
            return;
        }
        // 模拟更新操作：可将新密码更新后清空密码输入框
        const updatedAccount = {...account, newPassword: '', confirmPassword: ''};
        setAccount(updatedAccount);
        console.log('Updated account settings:', updatedAccount);
        alert('Account information updated! (查看 console.log 输出)');
    };

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border space-y-6">
                {/* 第一部分：用户信息 */}
                <div>
                    <h2 className="text-xl font-bold mb-4">User Information</h2>

                    {/* 1.1 只读信息展示 */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium">User ID:</p>
                                <p className="text-sm">{profile.userId}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Status:</p>
                                <p className="text-sm">{profile.status}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Role:</p>
                                <p className="text-sm">{profile.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* 1.2 可编辑信息 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <img
                                        src={profile.image || null}
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="avatar" className="block text-sm font-medium mb-1">
                                        Avatar
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleProfileChange}
                                        className="w-full text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={profile.username}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-white text-theme-text"
                                />
                            </div>
                            <div>
                                <label htmlFor="shopName" className="block text-sm font-medium mb-1">
                                    Contact
                                </label>
                                <input
                                    type="text"
                                    name="contact"
                                    id="contact"
                                    value={profile.contact}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-white text-theme-text"
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-2 bg-theme-primary text-white px-4 py-2 rounded hover:bg-theme-primaryHover transition duration-200"
                            >
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>


                <hr className="border-t border-theme-border mt-6"/>

                {/* 第二部分：账号设置 */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                    <form onSubmit={handleAccountUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={account.email}
                                onChange={handleAccountChange}
                                className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-white text-theme-text"
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={account.newPassword}
                                onChange={handleAccountChange}
                                className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-white text-theme-text"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={account.confirmPassword}
                                onChange={handleAccountChange}
                                className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-white text-theme-text"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-theme-primary text-white px-4 py-2 rounded hover:bg-theme-primaryHover transition duration-200"
                        >
                            Update Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;