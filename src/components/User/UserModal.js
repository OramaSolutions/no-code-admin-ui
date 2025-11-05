import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import { addUser, userList } from '../../reduxToolkit/Slices/userSlices';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const initialState = {
    name: "",
    email: "",
    phoneNumber: "",
    userName: "",
    password: "",
    loading: false,
    errors: {},
}

const UserModal = ({ onShow, onClose }) => {
    const dispatch = useDispatch();
    const [iState, setIstate] = useState(initialState)
    const { name, email, phoneNumber, userName, password, errors, loading } = iState;
    console.log(iState, "istaeeee")

    const inputHandler = (e) => {
        const { name, value } = e.target;
        if (name == 'phoneNumber') {
            const isvalid = /^[0-9]*$/.test(value)
            if (value.length <= 10) {
                if (isvalid) {
                    console.log(value.length, "valueeeeeeeeeee")
                    setIstate({ ...iState, [name]: value })
                } else {
                    const newValue = value.replace(/[^0-9]/g, '');
                    setIstate({ ...iState, [name]: newValue })
                }
            }
        }
        else {
            setIstate({ ...iState, [name]: value })
        }
    }
    //=========================================handle submit================================================================
    const handleSubmit = async (e) => {
        let formValid = handleValidation()
        if (formValid) {
            try {
                setIstate({ ...iState, loading: true })
                const data = { name, email, phoneNumber, userName, password };
                const res = await dispatch(addUser(data))
                console.log(res, "ressssssss")
                if (res?.payload?.code === 200) {
                    toast.success("User Add Successfully", commomObj)
                    onClose();
                    setIstate({ ...iState, email: "", password: "", name: "", phoneNumber: "", userName: "", loading: false, errors: {}, })
                    dispatch(userList({
                        page: 1,
                        startdate: "",
                        enddate: "",
                        search: "",
                        timeFrame: ""
                    }))
                }
                else {
                    toast.error(res?.payload?.message, commomObj)
                    setIstate({ ...iState, loading: false })
                }
            }
            catch (err) {
                toast.error(err?.payload?.message, commomObj)
                console.log("erttttrdesfg", err)
            }
        }

    };
    //==========================================handle validation=========================================================
    const handleValidation = () => {
        let error = {}
        let formValid = true
        if (!name?.trim()) {
            error.nameError = "*Name cannot be empty*"
            formValid = false
        }
        if (!email?.trim()) {
            error.emailError = "*Email cannot be empty*"
            formValid = false
        } else {
            if (!/^.+?@.+?\..+$/.test(email)) {
                error.emailError = "*Email format is not valid*"
                formValid = false
            }
        }
        if (!phoneNumber?.trim()) {
            error.phoneError = "*Phone Number cannot be empty*"
            formValid = false
        }
        if (!userName?.trim()) {
            error.userNameError = "*UserName cannot be empty*"
            formValid = false
        }
        if (!password?.trim()) {
            error.passwordError = "*Password cannot be empty*"
            formValid = false
        }
        setIstate({
            ...iState,
            errors: error
        })
        return formValid
    }
    const closeHandler = () => {
        onClose();
        setIstate((prev) => ({ ...prev, email: "", password: "", name: "", phoneNumber: "", userName: "", loading: false, errors: {}, }))
    }



    return (
        <div>
            <Modal
                show={onShow}
                className="ModalBox"
                onHide={closeHandler}
            >
                <Modal.Body>
                    <div className="Category">
                        <a
                            className="CloseModal"
                            data-dismiss="modal"
                            onClick={closeHandler}
                        >
                            ×
                        </a>
                        <h3>
                            Add New User
                        </h3>
                        <div className="form-group">
                            <label className="label">
                                Enter Name
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter Name"
                                type="text"
                                name='name'
                                value={name}
                                onChange={inputHandler}
                            />
                            <span style={{ color: 'red' }} >{errors.nameError}</span>
                        </div>
                        <div className="form-group">
                            <label className="label">
                                Enter Email id
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter Email"
                                type="text"
                                name='email'
                                value={email}
                                onChange={inputHandler}
                            />
                            <span style={{ color: 'red' }} >{errors.emailError}</span>
                        </div>
                        <div className="form-group">
                            <label className="label">
                                Enter Mobile no.
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter Mobile No"
                                type="text"
                                name='phoneNumber'
                                value={phoneNumber}
                                onChange={inputHandler}
                            />
                            <span style={{ color: 'red' }} >{errors.phoneError}</span>
                        </div>
                        <br />
                        <h3>
                            Create Login Credentials
                        </h3>
                        <div className="form-group">
                            <label className="label">
                                Enter Username
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter Username"
                                type="text"
                                name='userName'
                                value={userName}
                                onChange={inputHandler}
                            />
                            <span style={{ color: 'red' }} >{errors.userNameError}</span>
                        </div>
                        <div className="form-group">
                            <label className="label">
                                Enter Password
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter Password"
                                type="text"
                                name='password'
                                value={password}
                                onChange={inputHandler}
                            />
                            <span style={{ color: 'red' }} >{errors.passwordError}</span>
                        </div>
                        <button
                            className="Button"
                            disabled={loading}
                            onClick={handleSubmit}
                        >
                            Create User
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UserModal
