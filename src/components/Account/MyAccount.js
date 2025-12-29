import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewProfile, updateProfile, UploadDocumnet } from '../../reduxToolkit/Slices/authSlices';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import Layout from '../NavSideWrapper';
import ChangePasswordModal from './ChangePassword';
import {
    FaUserCircle,
    FaCamera,
    FaEdit,
    FaSave,
    FaTimes,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaKey
} from 'react-icons/fa';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const initialState = {
    name: "",
    email: "",
    contact: "",
    address: "",
    errors: {},
    loading: false,
    profilePic: "",
    isEditing: false
};

function MyAccount() {
    const dispatch = useDispatch();
    const { profileData, loader } = useSelector((state) => state.auth);
    const [istate, updateIstate] = useState(initialState);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { name, email, contact, address, errors, loading, profilePic, isEditing } = istate;

    useEffect(() => {
        const getData = async () => {
            const res = await dispatch(viewProfile());
            if (res?.payload?.code == 200) {
                updateIstate((prev) => ({
                    ...prev,
                    name: res?.payload?.activeUser?.name,
                    email: res?.payload?.activeUser?.email,
                    contact: res?.payload?.activeUser?.phoneNumber,
                    address: res?.payload?.activeUser?.address,
                    profilePic: res?.payload?.activeUser?.profilePic
                }));
            }
        };
        getData();
    }, []);

    const inputHandler = (e) => {
        const { name, value } = e.target;
        updateIstate({ ...istate, [name]: value });
    };

    const toggleEdit = () => {
        updateIstate(prev => ({ ...prev, isEditing: !prev.isEditing }));
    };

    const handleValidation = () => {
        let formIsValid = true;
        let error = {};

        if (!name?.trim()) {
            formIsValid = false;
            error.nameError = "Name is required";
        }

        if (!email.trim()) {
            error.emailError = "Email is required";
            formIsValid = false;
        } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            error.emailError = "Invalid email format";
            formIsValid = false;
        }

        if (!contact?.trim()) {
            formIsValid = false;
            error.contactError = "Contact number is required";
        }

        if (!address?.trim()) {
            formIsValid = false;
            error.addressError = "Address is required";
        }

        updateIstate({ ...istate, errors: error });
        return formIsValid;
    };

    const saveHandler = async () => {
        let formValid = handleValidation();
        if (formValid) {
            try {
                updateIstate({ ...istate, loading: true });
                const data = { name, email, phoneNumber: contact, address, profilePic };
                const res = await dispatch(updateProfile(data));

                if (res?.payload?.code === 200) {
                    updateIstate(prev => ({
                        ...prev,
                        loading: false,
                        isEditing: false,
                        errors: {}
                    }));
                    toast.success("Profile updated successfully!", commomObj);
                    window.localStorage.setItem("adminimage", JSON.stringify({ name, profilePic }));
                } else {
                    toast.error("Failed to update profile", commomObj);
                }
            } catch (err) {
                console.error(err);
                toast.error("An error occurred", commomObj);
            }
        }
    };

    const onFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload JPG, JPEG, PNG or WEBP format only", commomObj);
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("fileName", file);

        try {
            const response = await dispatch(UploadDocumnet(formData));
            if (response?.payload?.data?.code === 200) {
                toast.success("Profile picture uploaded successfully!", commomObj);
                updateIstate(prev => ({ ...prev, profilePic: response?.payload?.data?.url }));
            }
        } catch (error) {
            toast.error(error?.payload?.data?.message || "Upload failed", commomObj);
        } finally {
            setIsUploading(false);
        }
    };

    const cancelEdit = () => {
        updateIstate(prev => ({
            ...prev,
            isEditing: false,
            name: profileData?.activeUser?.name || "",
            email: profileData?.activeUser?.email || "",
            contact: profileData?.activeUser?.phoneNumber || "",
            address: profileData?.activeUser?.address || "",
            errors: {}
        }));
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-600 mt-2">Manage your profile information and security</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile Picture & Actions */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                                {/* Profile Picture */}
                                <div className="relative mx-auto w-48 h-48 mb-6">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                                        {name ? (
                                            <div className="w-full flex-col h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                <FaUserCircle className="text-6xl text-gray-400" />
                                               <span className='text-md font-semibold mt-2'>{name}</span> 
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                <FaUserCircle className="text-6xl text-gray-400" />
                                            </div>
                                        )}

                                        {/* Upload Overlay */}
                                        {/* <label className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors group">
                                            <FaCamera className="text-white text-lg" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={onFileHandler}
                                                disabled={isUploading}
                                            />
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Change photo
                                            </div>
                                        </label> */}
                                    </div>
                                </div>

                                {/* Upload Status */}
                                {isUploading && (
                                    <div className="text-center text-blue-600 text-sm mb-4">
                                        Uploading...
                                    </div>
                                )}

                                {/* User Info Summary */}
                                <div className="space-y-4 mb-8">
                                    <div className="text-center">
                                        {/* <h2 className="text-xl font-semibold text-gray-900">{name || "Your Name"}</h2> */}
                                        <p className="text-gray-600 mt-1">{email || "user@example.com"}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-700">
                                            <FaPhone className="text-gray-400 mr-3" />
                                            <span>{contact || "Not provided"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <FaMapMarkerAlt className="text-gray-400 mr-3" />
                                            <span className="truncate">{address || "Not provided"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password Button */}
                                <button
                                    onClick={() => setShowChangePasswordModal(true)}
                                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    <FaKey />
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Profile Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                {/* Form Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                        <p className="text-gray-600">Update your personal details here</p>
                                    </div>
                                    <button
                                        onClick={isEditing ? cancelEdit : toggleEdit}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                            }`}
                                    >
                                        {isEditing ? (
                                            <>
                                                <FaTimes />
                                                Cancel
                                            </>
                                        ) : (
                                            <>
                                                <FaEdit />
                                                Edit Profile
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    {/* Name Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.nameError ? 'border-red-500' : 'border-gray-300'
                                                    } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                                                placeholder="Enter your full name"
                                                name="name"
                                                value={name}
                                                onChange={inputHandler}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        {errors.nameError && (
                                            <p className="mt-2 text-sm text-red-600">{errors.nameError}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.emailError ? 'border-red-500' : 'border-gray-300'
                                                    } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                                                placeholder="Enter your email address"
                                                name="email"
                                                value={email}
                                                onChange={inputHandler}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        {errors.emailError && (
                                            <p className="mt-2 text-sm text-red-600">{errors.emailError}</p>
                                        )}
                                    </div>

                                    {/* Contact Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Number
                                        </label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.contactError ? 'border-red-500' : 'border-gray-300'
                                                    } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                                                placeholder="Enter your contact number"
                                                name="contact"
                                                value={contact}
                                                onWheel={(e) => e.target.blur()}
                                                onChange={inputHandler}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        {errors.contactError && (
                                            <p className="mt-2 text-sm text-red-600">{errors.contactError}</p>
                                        )}
                                    </div>

                                    {/* Address Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.addressError ? 'border-red-500' : 'border-gray-300'
                                                    } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                                                placeholder="Enter your address"
                                                name="address"
                                                value={address}
                                                onChange={inputHandler}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        {errors.addressError && (
                                            <p className="mt-2 text-sm text-red-600">{errors.addressError}</p>
                                        )}
                                    </div>

                                    {/* Save Button */}
                                    {isEditing && (
                                        <div className="pt-4">
                                            <button
                                                onClick={saveHandler}
                                                disabled={loading}
                                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaSave />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                <ChangePasswordModal
                    isOpen={showChangePasswordModal}
                    onClose={() => setShowChangePasswordModal(false)}
                />
            </div>
        </Layout>
    );
}

export default MyAccount;