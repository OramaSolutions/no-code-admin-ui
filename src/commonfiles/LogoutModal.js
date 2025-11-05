import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../utils';
import { toast } from 'react-toastify'

function LogoutModal({ show, handleClose }) {
const navigate=useNavigate();

const logout = async () => {   
    window.localStorage.removeItem("adminLogin")
    window.localStorage.removeItem("adminimage")
    toast.success(" Logout Successfully",commomObj);
    navigate('/')
}
    return (
        <div>
            < Modal
                className="ModalBox"
                show={show}
                onHide={handleClose}
            >
                <Modal.Body>
                    <div>
                        <Link className="CloseModal" onClick={handleClose}>
                            ×
                        </Link>

                        <div className='LogOutModalArea'>
                            <span><img src={require("../assets/images/logout-icon.png")} /></span>
                            <h3>Log Out</h3>
                            <p>Are you sure you want to Logout ?</p>
                            <div className='Buttons'>
                                <Link onClick={handleClose} className='CancelBtn' data-dismiss="modal" > Cancel</Link>
                                <a onClick={logout}  className='ConfirmBtn' > Confirm</a>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default LogoutModal
