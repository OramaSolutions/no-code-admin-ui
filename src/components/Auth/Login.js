import React, { useState } from 'react';
import { commomObj } from '../../utils';
import { adminLogin } from '../../reduxToolkit/Slices/authSlices';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const initialState = {
    email: "",
    password: "",
    loading: false,
    errors: {},
    showPassword: false,
};

const Login = () => {
    const [state, setState] = useState(initialState);
    const { email, password, loading, errors, showPassword } = state;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setState(prev => ({ ...prev, showPassword: !prev.showPassword }));
    };

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            [name]: value,
            errors: { ...prev.errors, [name + 'Error']: '' }
        }));
    };

    const handleValidation = () => {
        let error = {};
        let formValid = true;

        if (!email.trim()) {
            error.emailIdError = "Email is required";
            formValid = false;
        } else if (!/^.+?@.+?\..+$/.test(email)) {
            error.emailIdError = "Invalid email format";
            formValid = false;
        }

        if (!password.trim()) {
            error.PasswordError = "Password is required";
            formValid = false;
        }

        setState(prev => ({ ...prev, errors: error }));
        return formValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formValid = handleValidation();

        if (formValid) {
            try {
                setState(prev => ({ ...prev, loading: true }));
                const data = { email: email.trim(), password: password.trim() };
                const res = await dispatch(adminLogin(data));

                if (res?.payload?.code === 200) {
                    navigate('/dashboard');
                    toast.success(res.payload.message, commomObj);
                    setState(initialState);
                } else {
                    toast.error(res?.payload?.message || "Login failed", commomObj);
                    setState(prev => ({ ...prev, loading: false }));
                }
            } catch (err) {
                toast.error(err?.payload?.message || "An error occurred", commomObj);
                setState(prev => ({ ...prev, loading: false }));
            }
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <img
                            src={require("../../assets/images/Logo.png")}
                            alt="Logo"
                            className="h-10 mx-auto"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Admin Login</h2>
                    <p className="text-gray-600 text-sm mt-1">Enter your credentials to continue</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.emailIdError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="admin@example.com"
                                    name="email"
                                    value={email}
                                    onChange={inputHandler}
                                    disabled={loading}
                                />
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            {errors.emailIdError && (
                                <p className="mt-1 text-sm text-red-600">{errors.emailIdError}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"} // Change this line
                                className={`w-full pl-10 pr-10 py-2.5 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.PasswordError ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={inputHandler}
                                disabled={loading}
                            />
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={loading}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link
                                to="/login-forgot"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <FaSignInAlt />
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Simple Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Nocode - Admin Panel • ORAMA SOLUTIONS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;