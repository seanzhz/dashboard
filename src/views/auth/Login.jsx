// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { messageClear, sellerLogin } from "../../store/Reducers/authReducer";
import { getPreviewProducts } from "../../store/Reducers/productReducer";
import toast from "react-hot-toast";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);
    const { previewProducts, previewLoading, previewError } = useSelector(state => state.product);

    const [user, setUser] = useState({ email: "", password: "" });

    const inputChangeHandler = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(sellerLogin(user));
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setTimeout(() => { navigate('/') }, 1000);
        }
    }, [errorMessage, successMessage, dispatch, navigate]);

    useEffect(() => {
        dispatch(getPreviewProducts());
    }, [dispatch]);

    return (
        <div className="flex min-h-screen w-full bg-theme-bg">
            {/* 左侧 70% 区域：Logo + 前 4 条商品预览 */}
            <div className="w-[70%] flex flex-col p-8">
                <div className="mb-8 flex flex-col items-start">
                    <img
                        src="http://localhost:3000/img/logo.png"
                        alt="Logo"
                        className="h-20 w-auto mb-2"
                    />
                    <h1 className="text-3xl font-bold text-theme-text">
                        Welcome to Swappy Marketplace
                    </h1>
                    <p className="mt-2 text-theme-subtext">
                        Here are new posts. Login to browse more!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {previewLoading ? (
                        <div className="col-span-full flex justify-center items-center py-10">
                            <PropagateLoader color="#4f93ce" />
                        </div>
                    ) : previewError ? (
                        <p className="text-red-500 col-span-full">{previewError}</p>
                    ) : previewProducts.length === 0 ? (
                        <p className="text-gray-600 col-span-full">No products to preview.</p>
                    ) : (
                        previewProducts.map(product => {
                            const url = (product.promotionalImage && product.promotionalImage.length > 0)
                                ? product.promotionalImage[0]
                                : '/placeholder.png';

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white border border-theme-border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                                    onClick={() => {
                                        toast('🔒 Please login to view product details');
                                    }}
                                >
                                    <div className="relative h-40 w-full overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-center bg-cover filter blur-lg scale-105"
                                            style={{ backgroundImage: `url(${url})` }}
                                        />
                                        <img
                                            src={url}
                                            alt={product.name}
                                            className="relative mx-auto max-h-full"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-theme-text truncate">
                                            {product.name}
                                        </h3>
                                        <p className="mt-2 text-theme-subtext">${product.price?.toFixed(2)}</p>
                                        <p className="mt-1 text-sm text-gray-500 truncate">
                                            {product.description?.slice(0, 50) + (product.description?.length > 50 ? '…' : '')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-theme-subtext">
                        To explore all products, please{" "}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="font-bold text-theme-primary hover:underline"
                        >
                            login
                        </button>.
                    </p>
                </div>
            </div>

            <div className="w-px bg-theme-border"></div>

            {/* 右侧 30% 区域：登录表单 */}
            <div className="w-[30%] flex justify-center items-center">
                <div className="bg-theme-card shadow-lg border border-theme-border rounded-lg p-8 w-96">
                    <h2 className="text-xl font-bold text-center mb-3 text-theme-text">
                        Login to Your Account
                    </h2>

                    <form className="space-y-4" onSubmit={submitHandler}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-theme-text text-sm font-semibold mb-1"
                            >
                                Email
                            </label>
                            <input
                                onChange={inputChangeHandler}
                                value={user.email}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full border border-theme-border bg-theme-bgSecondary text-theme-text rounded px-3 py-2 focus:ring focus:border-theme-primary focus:bg-white"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-theme-text text-sm font-semibold mb-1"
                            >
                                Password
                            </label>
                            <input
                                onChange={inputChangeHandler}
                                value={user.password}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full border border-theme-border bg-theme-bgSecondary text-theme-text rounded px-3 py-2 focus:ring focus:border-theme-primary focus:bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-theme-primary text-white py-2 px-4 rounded hover:bg-theme-hover transition"
                        >
                            Login
                        </button>

                        {loader && (
                            <div className="flex justify-center items-center pt-2">
                                <PropagateLoader color="#4f93ce" />
                            </div>
                        )}

                        <br />

                        <hr className="my-4 border-theme-border" />
                        <p className="text-center text-theme-subtext">
                            Need an account?{" "}
                            <Link className="font-bold text-theme-primary hover:underline" to="/register">
                                Sign up
                            </Link>
                        </p>
                    </form>

                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-theme-border" />
                        <span className="mx-2 text-theme-subtext">OR</span>
                        <hr className="flex-grow border-theme-border" />
                    </div>

                    <div className="flex justify-center space-x-5">
                        <div
                            className="flex justify-center items-center overflow-hidden rounded-md cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => console.log("Login via Google clicked")}
                        >
                            <FaGoogle className="text-2xl" />
                        </div>

                        <div
                            className="flex justify-center items-center overflow-hidden rounded-md cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() => console.log("Login via Facebook clicked")}
                        >
                            <FaFacebook className="text-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;