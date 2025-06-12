import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {messageClear, updateAccount, updateUser} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";

/**
 * Profile component
 * Allows user to view and edit their profile and account settings.
 */
function Profile() {

    const dispatch = useDispatch();

    // Get user info and auth state from Redux store
    const {userInfo} = useSelector((state) => state.auth);
    const {errorMessage, successMessage} = useSelector(state => state.auth);

    // User profile state (readable and editable fields)
    const [profile, setProfile] = useState({
        userId: '',         // read-only
        status: '',         // read-only
        role: '',           // read-only
        image: '',          // preview URL for frontend
        imageFile: null,    // file for backend upload
        username: '',       // currently read-only (future: editable)
        contact: ''         // editable
    });

    // Account state (email + password change)
    const [account, setAccount] = useState({
        email: '',          // read-only
        oldPassword: '',    // input
        newPassword: '',    // input
        confirmPassword: '' // input
    });

    // Initialize profile and account state from userInfo
    useEffect(() => {
        if (userInfo) {
            setProfile({
                userId: userInfo._id,
                status: userInfo.status,
                role: userInfo.role,
                image: userInfo.image,
                username: userInfo.username,
                contact: userInfo.contact
            });
            setAccount(prev => ({
                ...prev,
                email: userInfo.email
            }));
        }
    }, [userInfo]);

    // Show toast messages for error/success and clear them after showing
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, successMessage, dispatch]);

    /**
     * Handle profile field change
     */
    const handleProfileChange = (e) => {
        const {name, value, files} = e.target;

        // If uploading an image file
        if (name === 'image' && files && files[0]) {
            const file = files[0];
            setProfile(prev => ({
                ...prev,
                imageFile: file,                         // for backend upload
                image: URL.createObjectURL(file)         // for frontend preview
            }));
        } else {
            setProfile(prev => ({...prev, [name]: value}));
        }
    };

    /**
     * Submit profile update
     */
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', profile.username);
        formData.append('contact', profile.contact);
        if (profile.imageFile) {
            formData.append('image', profile.imageFile);
        }
        dispatch(updateUser({id: userInfo._id, formData}));
    };

    /**
     * Handle account fields change (email, password)
     */
    const handleAccountChange = (e) => {
        const {name, value} = e.target;
        setAccount(prev => ({...prev, [name]: value}));
    };

    /**
     * Submit account update (change password)
     */
    const handleAccountUpdate = (e) => {
        e.preventDefault();
        // Check if new password matches confirmation
        if (account.newPassword !== account.confirmPassword) {
            alert('New password and confirmation do not match!');
            return;
        }
        // Dispatch update account action
        dispatch(updateAccount({
            id: userInfo._id,
            oldPassword: account.oldPassword,
            newPassword: account.newPassword
        }));

        // Reset password fields after submit
        const updatedAccount = {
            ...account,
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
        setAccount(updatedAccount);
    };

    return (
        <div className="container mx-auto p-4 px-2 lg:px-7 pt-5 text-theme-text">
            {/* Profile header */}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>

            {/* Profile form */}
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border space-y-6">

                {/* 1. User profile information */}
                <div>
                    <h2 className="text-xl font-bold mb-4">User Information</h2>

                    {/* 1.1 Read-only fields */}
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

                    {/* 1.2 Editable profile fields */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            {/* Avatar */}
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
                            {/* Username */}
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
                            {/* Contact */}
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium mb-1">
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
                            {/* Submit profile update */}
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

                {/* 2. Account settings (password change) */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                    <form onSubmit={handleAccountUpdate} className="space-y-4">
                        {/* Email (read-only) */}
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
                        {/* Old password */}
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
                        {/* New password */}
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
                        {/* Confirm new password */}
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
                        {/* Submit account update */}
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