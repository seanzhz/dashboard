import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {messageClear, updateAccount, updateUser} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";


function Profile() {

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);

    // User information editable and readable
    const [profile, setProfile] = useState({
        userId: '',         // Read
        status: '',           // Read
        role: '',              // Read
        image: '',             // 预览 URL（前端展示）
        imageFile: null,
        username: '',           // currently: read only //TODO: will be changeable in furture
        contact: ""     // edit
    });

    // Account part
    const [account, setAccount] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (userInfo) {
            setProfile({
                userId: userInfo._id,         // read
                status: userInfo.status,           // read
                role: userInfo.role,              // read
                image: userInfo.image, // edit
                username: userInfo.username,           // edit
                contact: userInfo.contact     // edit
            })
            setAccount({
                ...account,
                email: userInfo.email,
            })
        }
    }, [userInfo]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage]);


    // process profile changes
    const handleProfileChange = (e) => {
        const {name, value, files} = e.target;

        if (name === 'image' && files && files[0]) {
            const file = files[0];
            setProfile(prev => ({
                ...prev,
                imageFile: file,                         // For backend use
                image: URL.createObjectURL(file)         // For frontend view
            }));
        } else {
            setProfile(prev => ({...prev, [name]: value}));
        }
    };

    // submit
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', profile.username);
        formData.append('contact', profile.contact);
        if (profile.imageFile) {
            formData.append('image', profile.imageFile);
        }
        // // Debugging
        // for (let pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }
        dispatch(updateUser({id: userInfo._id, formData}))
    };


    // Process change of email and password
    const handleAccountChange = (e) => {
        const {name, value} = e.target;
        setAccount(prev => ({...prev, [name]: value}));
    };


    const handleAccountUpdate = (e) => {
        e.preventDefault();
        if (account.newPassword !== account.confirmPassword) {
            alert('New password and confirmation do not match!');
            return;
        }
        // Send to backend and clear all
        //console.log(account.newPassword);
        dispatch(updateAccount({id: userInfo._id, oldPassword: account.oldPassword, newPassword: account.newPassword}))
        const updatedAccount = {...account, password:'',newPassword: '', confirmPassword: ''};
        setAccount(updatedAccount);
    };

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border space-y-6">
                {/* 1. User profile information */}
                <div>
                    <h2 className="text-xl font-bold mb-4">User Information</h2>

                    {/* 1.1 Read part display */}
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

                    {/* 1.2 Editable information display */}
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
                                    disabled
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={profile.username}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-gray-100 text-theme-text"
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

                {/* 2. Account information */}
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
                                disabled
                                className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-gray-50 text-theme-text"
                            />
                        </div>
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
                                Old Password
                            </label>
                            <input
                                type="password"
                                name="oldPassword"
                                id="oldPassword"
                                value={account.oldPassword}
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