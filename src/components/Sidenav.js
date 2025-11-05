import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoutModal from '../commonfiles/LogoutModal'
import {
    FaTachometerAlt,
    FaUser,
    FaCube,
    FaExclamationTriangle,
    FaBell,
    FaUserCog,
    FaSignOutAlt,
    FaTimes
} from 'react-icons/fa'

const initialState = {
    show: false
}

const Sidenav = ({ isOpen, onClose }) => {
    const [istate, setIstate] = useState(initialState)
    const { show } = istate

    const handleClose = () => {
        setIstate({ ...istate, show: false })
    }

    const showlogoutHandler = () => {
        setIstate({ ...istate, show: true })
    }

    const menuItems = [
        {
            path: '/dashboard',
            name: 'Dashboard',
            icon: FaTachometerAlt,
            color: 'text-blue-600'
        },
        {
            path: '/user-management',
            name: 'User Management',
            icon: FaUser,
            color: 'text-green-600'
        },
        {
            path: '/project-management',
            name: 'Project Management',
            icon: FaCube,
            color: 'text-purple-600'
        },
        {
            path: '/report-management',
            name: 'Reported Issue Management',
            icon: FaExclamationTriangle,
            color: 'text-orange-600'
        },
        {
            path: '/notification-management',
            name: 'Notification Management',
            icon: FaBell,
            color: 'text-indigo-600'
        },
        {
            path: '/my-account-management',
            name: 'My Account',
            icon: FaUserCog,
            color: 'text-gray-600'
        }
    ]

    // Close sidebar on mobile when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && window.innerWidth < 768) {
                const sidebar = document.getElementById('sidebar')
                if (sidebar && !sidebar.contains(event.target)) {
                    onClose()
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>
            )}
            
            <aside 
                id="sidebar"
                className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Section with Close Button */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-100 to-blue-200">
                    <img
                        src={require("../assets/images/Logo.png")}
                        alt="Logo"
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none'
                        }}
                    />
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Close sidebar"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => {
                            const IconComponent = item.icon
                            return (
                                <li key={index}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => window.innerWidth < 768 && onClose()}
                                    >
                                        {({ isActive }) => (
                                            <div className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-blue-50 text-blue-700 border-r-3 border-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}>
                                                <div className="flex items-center justify-center w-6 h-6 mr-3">
                                                    <IconComponent
                                                        className={`w-5 h-5 transition-colors duration-200 ${
                                                            isActive ? 'text-blue-600' : `${item.color} group-hover:${item.color}`
                                                        }`}
                                                    />
                                                </div>
                                                <span className="truncate">{item.name}</span>
                                            </div>
                                        )}
                                    </NavLink>
                                </li>
                            )
                        })}

                        {/* Divider */}
                        <li className="pt-4">
                            <div className="border-t border-gray-200"></div>
                        </li>

                        {/* Logout Button */}
                        <li className="pt-2">
                            <button
                                onClick={showlogoutHandler}
                                className="group w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
                            >
                                <div className="flex items-center justify-center w-6 h-6 mr-3">
                                    <FaSignOutAlt className="w-5 h-5 transition-colors duration-200" />
                                </div>
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Footer/Version Info */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Admin Portal v2.0</p>
                    </div>
                </div>
            </aside>

            <LogoutModal
                show={show}
                handleClose={handleClose}
            />
        </>
    )
}

export default Sidenav
