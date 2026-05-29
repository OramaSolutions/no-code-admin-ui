
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux'
import { useSelector } from 'react-redux';
import store from "../src/reduxToolkit/store.js"
import { ToastContainer ,Slide} from 'react-toastify';
import Login from './components/Auth/Login.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import Forgot from './components/Auth/Forgot.js';
import ResetPassword from './components/Auth/ResetPassword.js';
import LoginVerification from './components/Auth/LoginVerification.js';
import LoginSuccess from './components/Auth/LoginSuccess.js';
import UserManagement from './components/User/UserManagement.js';
import UserDetails from './components/User/UserDetails.js';
import ProjectManagement from './components/Project/ProjectManagement.js';
import ReportManagement from './components/Report/ReportManagement.js';
import NotificationManagement from './components/Notification/NotificationManagement.js';
import ApplicationManagement from './components/ApplicationManagement/ApplicationManagement.js';
import MyAccount from './components/Account/MyAccount.js';
import ProjectDetails from './components/Project/ProjectDetails.js';

import Notes from './components/Report/Notes.js';

import ReportDetails from './components/Report/ReportDetails.js';

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/login-forgot' element={<PublicRoute><Forgot /></PublicRoute>} />
        <Route path='/resetPassword' element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path='/loginVerification' element={<PublicRoute><LoginVerification /></PublicRoute>} />
        <Route path='/loginSuccess' element={<PublicRoute><LoginSuccess /></PublicRoute>} />

        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path='/user-management' element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path='/user-management-details/:type' element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />

        <Route path='/project-management' element={<ProtectedRoute><ProjectManagement /></ProtectedRoute>} />
        <Route path='/project-details' element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />

        <Route path='/report-management' element={<ProtectedRoute><ReportManagement /></ProtectedRoute>} />
        <Route path='/report-management-detail' element={<ProtectedRoute><ReportDetails /></ProtectedRoute>} />
        <Route path='/notes' element={<ProtectedRoute><Notes /></ProtectedRoute>} />

        <Route path='/notification-management' element={<ProtectedRoute><NotificationManagement /></ProtectedRoute>} />
        <Route path='/application-management' element={<ProtectedRoute><ApplicationManagement /></ProtectedRoute>} />
        <Route path='/my-account-management' element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <React.Fragment>
        <ToastContainer 
        transition={Slide} 
        />
        <AppRoutes />
        </React.Fragment>
      
      </div>
    </Provider>

  );
}

export default App;
