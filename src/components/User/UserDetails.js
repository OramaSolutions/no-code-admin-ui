import React from 'react'
import Sidenav from '../Sidenav'
import Header from '../Header'
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { Link, useLocation, useParams } from 'react-router-dom';
import ProjectManagement from '../Project/ProjectManagement';

function UserDetails() {
    const userId = window.localStorage.getItem("userId")
    const { type } = useParams();
    const{state}=useLocation();
    console.log(state,"stateeeeeee")
    return (
        <div>
            <Sidenav />
            <Header />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="">
                        <div className="TitleBox">
                            <h4 className="Title">User Management</h4>
                        </div>
                        <Tab.Container id="left-tabs-example" defaultActiveKey={type}>
                            <div className="CommonTabs">
                                <Nav variant="tabs" className="nav nav-tabs">
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link" as={Link} state={state} eventKey='personal' to='/user-management-details/personal' >
                                            Personal Details
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="nav-item">
                                        <Nav.Link className="nav-link" as={Link} state={state} eventKey='project' to='/user-management-details/project' >
                                            Project History
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                            <Tab.Content className="tab-content">
                                <Tab.Pane className="tab-pane" eventKey='personal'>
                                    <div className="Small-Wrapper">
                                        <div className="BusinessPersonal">
                                            <figure>
                                                <img src={state?.profilePic?state.profilePic:require("../../assets/images/Avatar-1.png")} />
                                            </figure>
                                            <figcaption>
                                                <h3>{state?.name}</h3>
                                                <p>
                                                    <strong>User ID : </strong>{state?.user_number}
                                                </p>
                                            </figcaption>
                                        </div>
                                        <div className="InformationBox">
                                            <h4>Personal Details</h4>
                                            <div className="Information">
                                                <article>
                                                    <aside>
                                                        <p>
                                                            <strong>Name</strong> <span>{state?.name}</span>
                                                        </p>
                                                        <p>
                                                            <strong>Email Id</strong> <span>{state?.email}</span>
                                                        </p>
                                                        <p>
                                                            <strong>Mobile No</strong> <span>{state?.phoneNumber}</span>
                                                        </p>
                                                    </aside>
                                                </article>
                                            </div>
                                        </div>
                                        <div className="InformationBox">
                                            <h4>Login Credentials</h4>
                                            <div className="Information">
                                                <article>
                                                    <aside>
                                                        <p>
                                                            <strong>Username</strong> <span>{state?.userName}</span>
                                                        </p>
                                                        <p>
                                                            <strong>Password</strong> <span> ##########</span>
                                                        </p>
                                                    </aside>
                                                </article>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane className="tab-pane" eventKey='project'>
                                    <ProjectManagement
                                        userId={userId}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserDetails
