import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { addStatus, projectList } from '../../reduxToolkit/Slices/projectSlices';


const initialState = {
    statusName: "",
    errors: {},
    loading: false,
}

function UpdateModal({ istate, setIstate,userId }) {
    const dispatch=useDispatch();
    const { openModal, status, id } = istate;
    const [updateStatus, setUpdateStatus] = useState(initialState)
    const { statusName, errors, loading } = updateStatus

    const closeHandler = () => {
        setIstate({ ...istate, openModal: false, id: "" })
    }

    const inputHandler = (e) => {
        const { name, value } = e.target
        setUpdateStatus({ ...updateStatus, [name]: value })
    }
    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!statusName?.trim()) {
            formIsValid = false
            error.nameError = "*required to fill"
        }
        setUpdateStatus({ ...updateStatus, errors: error })
        return formIsValid
    }

    const saveHandler=async()=>{
        let formValid = handleValidation()
        if(formValid){
            try{
                setUpdateStatus({ ...updateStatus, loading:true })
                const data={id,status:statusName}
                const res=await dispatch(addStatus(data))
                if (res?.payload?.code === 200) {
                    setUpdateStatus({ ...updateStatus, loading:false,statusName:"",errors:{}})
                    toast.success("Added Successfully", commomObj);
                   closeHandler()
                   dispatch(projectList({userId:userId?userId:"", page:"",startdate: "",enddate: "",search: "",timeFrame: "",}))
                }else{
                    toast.error("Oops!something went wrong", commomObj);
                    setUpdateStatus({ ...updateStatus, loading:false,statusName:"",errors:{}})
                }    
            }catch(err){
               console.log(err,"errrrrrrr")
               setUpdateStatus({ ...updateStatus, loading:false,statusName:"",errors:{}})
            }
        }
       
    }

    return (
        <>
            < Modal
                className="ModalBox"
                show={openModal}
                onHide={closeHandler}
            >

                <div className="Category">
                    <Link className="CloseModal" onClick={closeHandler} >
                        ×
                    </Link>
                    <h3>Update Project/ Version Status</h3>
                    <div className="form-group">
                        <label className="label">Current Status</label>
                        <input
                            type="text"
                            className="form-control"
                            value={status}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Select Status</label>
                        <select
                            name="statusName"
                            value={statusName}
                            onChange={inputHandler}
                            className="form-control"
                        >
                            <option value="">--Select--</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSE">Close</option>
                        </select>
                        <span style={{ color: 'red' }} >{errors?.nameError}</span>
                    </div>
                    <a className="Button" onClick={saveHandler} style={{ pointerEvents: loading ? 'none' : '' }}>
                        Update Status
                    </a>
                </div>


            </Modal>

        </>
    )
}

export default UpdateModal
