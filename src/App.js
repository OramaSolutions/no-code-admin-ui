import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux'
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
import MyAccount from './components/Account/MyAccount.js';
import ProjectDetails from './components/Project/ProjectDetails.js';
import AddNotes from './components/Report/Notes.js';
import Notes from './components/Report/Notes.js';
import ChangePassword from './components/Account/ChangePassword.js';
import ReportDetails from './components/Report/ReportDetails.js';


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <React.Fragment>
        <ToastContainer 
        transition={Slide} 
        />
        <BrowserRouter>
          <Routes>
            <Route path='/' element= {<Login/>}/>
            <Route path='/login-forgot' element= {<Forgot/>}/>
            <Route path='/resetPassword' element= {<ResetPassword/>}/>
            <Route path='/loginVerification' element= {<LoginVerification/>}/>
            <Route path='/loginSuccess' element= {<LoginSuccess/>}/>

            <Route path='/dashboard' element= {<Dashboard/>}/>

            <Route path='/user-management' element= {<UserManagement/>}/>
            <Route path='/user-management-details/:type' element= {<UserDetails/>}/>

            <Route path='/project-management' element= {<ProjectManagement/>}/>
            <Route path='/project-details' element= {<ProjectDetails/>}/>

            <Route path='/report-management' element= {<ReportManagement/>}/>
            <Route path='/report-management-detail' element= {<ReportDetails/>}/>
            <Route path='/notes' element= {<Notes/>}/>

            <Route path='/notification-management' element= {<NotificationManagement/>}/>

            <Route path='/my-account-management' element= {<MyAccount/>}/>
            {/* <Route path='/settings' element= {<ChangePassword/>}/> */}


          </Routes>
        </BrowserRouter>
        </React.Fragment>
      
      </div>
    </Provider>

  );
}

export default App;
