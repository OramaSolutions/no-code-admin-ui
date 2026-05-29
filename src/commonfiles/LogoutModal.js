import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../utils';
import { toast } from 'react-toastify'
import axios from "axios";
import { Url } from '../config/config';
import { logoutUser } from '../reduxToolkit/Slices/authSlices';


function LogoutModal({ show, handleClose }) {
const navigate=useNavigate();
const dispatch = useDispatch();


const logout = async () => {
  try {
    await axios.get(
      `${Url}admin/logout`,
      {
        withCredentials: true, // ✅ IMPORTANT
      }
    );

    dispatch(logoutUser());
    toast.success("Logout Successfully", commomObj);
    navigate("/");
  } catch (err) {
    dispatch(logoutUser());
    toast.success("Logout Successfully", commomObj);
    navigate("/");
    console.error(err);
  }
};

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
                            <span><img alt='Logout' src={require("../assets/images/logout-icon.png")} /></span>
                            <h3>Log Out</h3>
                            <p>Are you sure you want to Logout ?</p>
                            <div className='Buttons'>
                                <Link onClick={handleClose} className='CancelBtn' data-dismiss="modal" > Cancel</Link>
                                <button onClick={logout}  className='ConfirmBtn' > Confirm</button>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default LogoutModal
