import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify'
import { approvalStatus,projectList } from '../../reduxToolkit/Slices/projectSlices';

function ApprovedModal({ istate, setIstate,userId }) {
    console.log(userId,"userId in approval modal")
    const dispatch=useDispatch();
    const { show, id, type } = istate
    const handleClose = () => {
        setIstate({ ...istate, show:false, id: '', type: "" })
    }
    const saveHandler = async () => {
        try {            
            const data = { id, status: type == "Approved" ? "ACCEPT" : "REJECT" }
            const res = await dispatch(approvalStatus(data))
            if (res?.payload?.code === 200) {               
                toast.success("Updated Successfully", commomObj);
                console.log(userId,"userId before api")
                handleClose()
                console.log(userId,"userId after api")

                dispatch(projectList({userId:userId?userId:"", page: "", startdate: "", enddate: "", search: "", timeFrame: "", }))
            } else {
                toast.error("Oops!something went wrong", commomObj);                
            }
        } catch (err) {
            console.log(err, "errrrrrrr")           
        }
    }
    
    return (
        <>
            < Modal
                className="ModalBox"
                show={show}
                onHide={handleClose}
            >
                <Modal.Body>
                    <div>
                        <div className='LogOutModalArea'>
                            <h3>Confirmation</h3>
                            <p>Are you sure you want to {type} this project ?</p>
                            <div className='Buttons'>
                                <Link className='CancelBtn' data-dismiss="modal" onClick={handleClose} > Cancel</Link>
                                <Link className='ConfirmBtn'  onClick={saveHandler}> Confirm</Link>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ApprovedModal
