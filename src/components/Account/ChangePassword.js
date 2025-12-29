import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { commomObj } from '../../utils';
import { changePassword } from '../../reduxToolkit/Slices/authSlices';
import { FaEye, FaEyeSlash, FaKey, FaTimes } from 'react-icons/fa';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    oldpassword: '',
    newpassword: '',
    reenterpassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const { oldpassword, newpassword, reenterpassword } = input;

  const handleinput = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!oldpassword.trim()) {
      newErrors.oldpassword = 'Current password is required';
    }

    if (!newpassword.trim()) {
      newErrors.newpassword = 'New password is required';
    } else if (newpassword.length < 6) {
      newErrors.newpassword = 'Password must be at least 6 characters';
    }

    if (!reenterpassword.trim()) {
      newErrors.reenterpassword = 'Please confirm your password';
    } else if (newpassword !== reenterpassword) {
      newErrors.reenterpassword = 'Passwords do not match';
    }

    if (oldpassword === newpassword && oldpassword) {
      newErrors.newpassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await dispatch(
        changePassword({
          password: oldpassword,
          newPassword: newpassword,
        })
      );

      if (res?.payload?.code === 200) {
        toast.success("Password changed successfully!", commomObj);
        handleClose();
      } else {
        toast.error(res?.payload?.message || "Current password is incorrect", commomObj);
        setErrors(prev => ({ ...prev, oldpassword: 'Current password is incorrect' }));
      }
    } catch (error) {
      toast.error("Failed to change password", commomObj);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInput({
      oldpassword: '',
      newpassword: '',
      reenterpassword: '',
    });
    setErrors({});
    setShowPasswords({
      old: false,
      new: false,
      confirm: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaKey className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your password securely</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlesubmit} className="p-6 space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12 ${
                    errors.oldpassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter current password"
                  name="oldpassword"
                  value={oldpassword}
                  onChange={handleinput}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.oldpassword && (
                <p className="mt-2 text-sm text-red-600">{errors.oldpassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12 ${
                    errors.newpassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                  name="newpassword"
                  value={newpassword}
                  onChange={handleinput}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.newpassword && (
                <p className="mt-2 text-sm text-red-600">{errors.newpassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12 ${
                    errors.reenterpassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
                  name="reenterpassword"
                  value={reenterpassword}
                  onChange={handleinput}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.reenterpassword && (
                <p className="mt-2 text-sm text-red-600">{errors.reenterpassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center gap-2 ${newpassword.length >= 6 ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${newpassword.length >= 6 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                  At least 6 characters long
                </li>
                <li className={`flex items-center gap-2 ${oldpassword !== newpassword && newpassword ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${oldpassword !== newpassword && newpassword ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                  Different from current password
                </li>
                <li className={`flex items-center gap-2 ${newpassword === reenterpassword && newpassword ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${newpassword === reenterpassword && newpassword ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                  Passwords match
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;