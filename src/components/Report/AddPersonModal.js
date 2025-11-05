import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify'
import { addAssignPerson } from '../../reduxToolkit/Slices/reportSlices';

const initialState = {
    name: "",
    email: "",
    errors: {},
    loading:false,
}

function AddPersonModal({ output, setOutput, istate, setIstate }) {
    const dispatch=useDispatch();
    const { open } = output;
    const [assignPerson, setAssignPerson] = useState(initialState)
    const { name, email, errors,loading } = assignPerson

    const closeHandler = () => {
        setOutput({ ...output, open: false })
        setIstate({ ...istate, openModal: true })
    }
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setAssignPerson({ ...assignPerson, [name]: value })
    }

    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!name?.trim()) {
            formIsValid = false
            error.nameError = "*required to fill"
        } if (!email.trim()) {
            error.emailError = " *Email or can't be empty";
            formIsValid = false;
        }
        else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            error.emailError = " * Email format is not valid";
            formIsValid = false;
        }
        setAssignPerson({ ...assignPerson, errors: error })
        return formIsValid
    }

    const saveHandler=async()=>{
        let formValid = handleValidation()
        if(formValid){
            try{
                setAssignPerson({ ...assignPerson, loading:true })
                const data={name,email}
                const res=await dispatch(addAssignPerson(data))
                if (res?.payload?.code === 200) {
                    setAssignPerson({ ...assignPerson, loading:false,name:"",email:"",errors:{}})
                    toast.success("Added Successfully", commomObj);
                   closeHandler()
                }else{
                    toast.error("Oops!something went wrong", commomObj);
                }    
            }catch(err){
    
            }
        }
       
    }
    return (
        <>
            < Modal
                className="ModalBox"
                show={open}
                onHide={closeHandler}
            >
                <Modal.Body>
                    <div>
                        <div className="Category">
                            <Link className="CloseModal" onClick={closeHandler}>
                                ×
                            </Link>
                            <h3>Add New Person</h3>
                            <div className="form-group">
                                <label className="label">Name of Person</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Name of Person"
                                    name="name"
                                    value={name}
                                    onChange={inputHandler}
                                />
                                <span style={{ color: 'red' }} >{errors?.nameError}</span>
                            </div>
                            <div className="form-group">
                                <label className="label">Email of Person</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Email of Person"
                                    name="email"
                                    value={email}
                                    onChange={inputHandler}
                                />
                                <span style={{ color: 'red' }} >{errors?.emailError}</span>
                            </div>
                            <a className="Button" onClick={saveHandler} style={{ pointerEvents: loading ? 'none' : '' }}>
                                Add
                            </a>
                        </div>


                    </div>
                </Modal.Body>
            </Modal>
        </>


    )
}

export default AddPersonModal
