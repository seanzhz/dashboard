import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {adminLogin, messageClear} from "../../store/Reducers/authReducer";
import {PropagateLoader} from "react-spinners";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

function AdminLogin() {
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
        dispatch(adminLogin(user));
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
    }, [errorMessage, successMessage]);

    return (
        <div className="flex justify-center items-center min-h-screen min-w-screen bg-theme-bg">
            <div className="bg-theme-card shadow-lg rounded-lg p-8 w-96 border border-theme-border">
                <div className='h-[70px] flex justify-center items-center mb-2'>
                    <div className='w-[180px] h-[50px]'>
                        <img className='w-full h-full' src="http://localhost:3000/img/logo.png" alt="admin Logo"/>
                    </div>
                </div>

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
                            className="w-full border border-theme-border rounded px-3 py-2 bg-theme-bgSecondary text-theme-text focus:ring focus:border-theme-primary"
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
                            className="w-full border border-theme-border rounded px-3 py-2 bg-theme-bgSecondary text-theme-text focus:ring focus:border-theme-primary"
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
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;