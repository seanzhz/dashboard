import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {FaFacebook, FaGoogle} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {PropagateLoader} from "react-spinners";
import {messageClear, sellerRegister} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";

function Register() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);
    const [user, setUser] = React.useState({
        username: "",
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
        dispatch(sellerRegister(user));
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/login');
        }
    }, [errorMessage, successMessage]);

    return (
        <div className="flex justify-center items-center min-h-screen min-w-screen bg-theme-bg">
            <div className="bg-theme-card border border-theme-border shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-xl font-bold text-center mb-3 text-theme-text">Welcome to Swappy</h2>
                <h2 className="text-l font-semibold text-center mb-3 text-theme-subtext">Register your account</h2>

                <form className="space-y-4" onSubmit={submitHandler}>
                    <div>
                        <label className="block text-theme-text text-sm font-semibold mb-1" htmlFor="username">
                            Community Name (Not changeable)
                        </label>
                        <input
                            onChange={inputChangeHandler}
                            value={user.username}
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter your prefrred name"
                            className="w-full border border-theme-border bg-theme-bgSecondary text-theme-text rounded px-3 py-2 focus:ring focus:border-theme-primary focus:bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-theme-text text-sm font-semibold mb-1" htmlFor="email">
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
                        <label className="block text-theme-text text-sm font-semibold mb-1" htmlFor="password">
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

                    <div>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                className="form-checkbox border-theme-border text-theme-primary focus:ring focus:border-theme-primary"
                                required
                            />
                            <span className="ml-2 text-sm text-theme-subtext">
                                I agree to the
                                <a href="" className="text-theme-primary underline ml-1">terms and conditions</a>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-theme-primary text-white py-2 px-4 rounded hover:bg-theme-hover transition"
                    >
                        Register
                    </button>

                    {loader && (
                        <div className='flex justify-center items-center pt-2'>
                            <PropagateLoader color="#4f93ce" />
                        </div>
                    )}
                    <br/>

                    <hr className="my-4 border-theme-border" />
                    <p className="text-center text-theme-subtext">
                        Already have an account? <Link className='font-bold text-theme-primary hover:underline' to='/login'>Login</Link>
                    </p>
                </form>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-theme-border" />
                    <span className="mx-2 text-theme-subtext">OR</span>
                    <hr className="flex-grow border-theme-border" />
                </div>

                <div className='inline-block space-x-5 justify-center flex'>
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
    );
}

export default Register;