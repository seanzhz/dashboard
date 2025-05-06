import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {FaFacebook, FaGoogle} from "react-icons/fa";
import {PropagateLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import {messageClear, sellerLogin} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);

    const [user, setUser] = React.useState({
        email: "",
        password: ""
    });

    const inputChangeHandler = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(sellerLogin(user))
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setTimeout(() => {navigate('/')},1000)
        }
    }, [errorMessage, successMessage]);


    return (
        <div className="flex justify-center items-center min-h-screen min-w-screen bg-theme-bg">
            <div className="bg-theme-card shadow-lg border border-theme-border rounded-lg p-8 w-96">
                <h2 className="text-xl font-bold text-center mb-3 text-theme-text">Welcome to Online Shopping</h2>
                <h2 className="text-l font-semibold text-center mb-3 text-theme-subtext">Login to your account</h2>

                <form className="space-y-4" onSubmit={submitHandler}>
                    <div>
                        <label
                            className="block text-theme-text text-sm font-semibold mb-1"
                            htmlFor="email"
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
                            className="block text-theme-text text-sm font-semibold mb-1"
                            htmlFor="password"
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
                        <div className='flex justify-center items-center pt-2'>
                            <PropagateLoader color="#4f93ce" />
                        </div>
                    )}

                    <br/>

                    <hr className="my-4 border-theme-border"/>
                    <p className="text-center text-theme-subtext">
                        Need an account? <Link className='font-bold text-theme-primary hover:underline' to='/register'>Sign up</Link>
                    </p>
                </form>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-theme-border"/>
                    <span className="mx-2 text-theme-subtext">OR</span>
                    <hr className="flex-grow border-theme-border"/>
                </div>

                <div className='space-x-5 justify-center flex'>
                    <div
                        className="flex justify-center items-center overflow-hidden rounded-md cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => console.log("Login via Google clicked")}
                    >
                        <i className="text-2xl">
                            <FaGoogle />
                        </i>
                    </div>

                    <div
                        className="flex justify-center items-center overflow-hidden rounded-md cursor-pointer text-blue-600 hover:text-blue-800"
                        onClick={() => console.log("Login via Facebook clicked")}
                    >
                        <i className="text-2xl">
                            <FaFacebook />
                        </i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;