import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoutModal from '../commonfiles/LogoutModal'
import { viewProfile } from '../reduxToolkit/Slices/authSlices'
import { useDispatch } from 'react-redux'
import { FaUserCircle, FaCog, FaSignOutAlt, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa'

const initialState = {
    show: false,
    sellerData: {},
    dropdownOpen: false
}

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
    const dispatch = useDispatch();
    const [istate, setIstate] = useState(initialState)
    const { show, sellerData, dropdownOpen } = istate
    const profileimage = JSON.parse(window.localStorage.getItem("adminimage"))
    const adminLogin = JSON.parse(window.localStorage.getItem("adminLogin"))
    const dropdownRef = useRef(null)

    const handleClose = () => {
        setIstate({ ...istate, show: false })
    }

    const showlogoutHandler = () => {
        console.log('logout handler')
        setIstate({ ...istate, show: true, dropdownOpen: false })
    }

    const toggleDropdown = () => {
        setIstate({ ...istate, dropdownOpen: !dropdownOpen })
    }

    const closeDropdown = () => {
        setIstate({ ...istate, dropdownOpen: false })
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIstate(prev => ({ ...prev, dropdownOpen: false }))
            }
        }

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownOpen])

    const profilePic = profileimage?.profilePic || adminLogin?.activeUser?.profilePic || '/default-avatar.png'
    const userName = sellerData?.name || adminLogin?.activeUser?.email || 'Administrator'

    return (
        <>
            <header className={`bg-white h-16 border-b border-gray-200 shadow-sm sticky top-0 z-40 transition-all duration-300 `}>
                <div className="flex h-full items-center justify-between px-6">
                    {/* Left side with menu button */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                            aria-label="Toggle sidebar"
                        >
                            <div className="relative w-5 h-5">
                                <FaBars
                                    className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isSidebarOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                                        }`}
                                />
                                <FaTimes
                                    className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isSidebarOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                                        }`}
                                />
                            </div>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">Admin Portal</h1>
                    </div>

                    {/* Right side - User profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                                onError={(e) => {
                                    e.target.src = '/default-avatar.png'
                                }}
                            />
                            <div className="hidden md:flex flex-col text-left">
                                <span className="text-sm font-medium text-gray-900 truncate max-w-32">
                                    {userName}
                                </span>
                                <span className="text-xs text-gray-500">Administrator</span>
                            </div>
                            <FaChevronDown
                                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-xl z-50 overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={profilePic}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {userName}
                                            </p>
                                            <p className="text-xs text-gray-500">Administrator</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-2">
                                    <NavLink
                                        to="/my-account-management"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                                        onClick={closeDropdown}
                                    >
                                        <FaUserCircle className="w-4 h-4 text-blue-500 mr-3" />
                                        <span className="font-medium">My Account</span>
                                    </NavLink>

                                    <NavLink
                                        to="/settings"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2.5 text-sm transition-colors duration-150 ${isActive
                                                ? 'text-blue-700 bg-blue-50 border-r-3 border-blue-600'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                            }`
                                        }
                                        onClick={closeDropdown}
                                    >
                                        <FaCog className="w-4 h-4 text-gray-500 mr-3" />
                                        <span className="font-medium">Settings</span>
                                    </NavLink>

                                    <hr className="my-2 border-gray-200" />

                                    <button
                                        onClick={showlogoutHandler}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                    >
                                        <FaSignOutAlt className="w-4 h-4 text-red-500 mr-3" />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <LogoutModal
                show={show}
                handleClose={handleClose}
            />
        </>
    )
}

export default Header
