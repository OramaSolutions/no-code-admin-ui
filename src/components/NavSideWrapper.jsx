import React, { useState } from 'react'
import Header from './Header'
import Sidenav from './Sidenav'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidenav isOpen={sidebarOpen} onClose={closeSidebar} />
            
            {/* Main content area */}
            <div className={`transition-all duration-300  ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <Header 
                    onToggleSidebar={toggleSidebar} 
                    isSidebarOpen={sidebarOpen} 
                />
                
                {/* Page content */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout
