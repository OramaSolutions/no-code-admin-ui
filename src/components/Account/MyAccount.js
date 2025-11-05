
import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { viewProfile, updateProfile } from '../../reduxToolkit/Slices/authSlices';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify'
import { UploadDocumnet } from '../../reduxToolkit/Slices/authSlices';
import Layout from '../NavSideWrapper';

const initialState = {
    name: "",
    email: "",
    contact: "",
    address: "",
    errors: {},
    loading: false,
    profilePic: "",
}

function MyAccount() {
    const dispatch = useDispatch();
    const { profileData, loader } = useSelector((state) => state.auth)
    console.log(profileData, "profileData")
    const [istate, updateIstate] = useState(initialState)
    const { name, email, contact, address, errors, loading, profilePic } = istate;

    useEffect(() => {
        const getData = async () => {
            const res = await dispatch(viewProfile())
            if (res?.payload?.code == 200) {
                updateIstate((prev) => ({ ...prev, name: res?.payload?.activeUser?.name, email: res?.payload?.activeUser?.email, contact: res?.payload?.activeUser?.phoneNumber, address: res?.payload?.activeUser?.address, profilePic: res?.payload?.activeUser?.profilePic }))
            }
        }
        getData();
    }, [])

    const inputHandler = (e) => {
        const { name, value } = e.target
        updateIstate({ ...istate, [name]: value })
    }

    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!name?.trim()) {
            formIsValid = false
            error.nameError = "*required to fill"
        } if (!email.trim()) {
            error.emailError = " *Email can't be empty";
            formIsValid = false;
        }
        else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            error.emailError = " * Email format is not valid";
            formIsValid = false;
        }
        if (!contact?.trim()) {
            formIsValid = false
            error.contactError = "*required to fill"
        }
        if (!address?.trim()) {
            formIsValid = false
            error.addressError = "*required to fill"
        }
        updateIstate({ ...istate, errors: error })
        return formIsValid
    }
    const saveHandler = async () => {
        let formValid = handleValidation()
        if (formValid) {
            try {
                updateIstate({ ...istate, loading: true })
                const data = { name, email, phoneNumber: contact, address, profilePic }
                const res = await dispatch(updateProfile(data))
                if (res?.payload?.code === 200) {
                    updateIstate({ ...istate, loading: false, name: profileData?.activeUser?.name, email: profileData?.activeUser?.email, contact: profileData?.activeUser?.contact, address: profileData?.activeUser?.address, profilePic: res?.payload?.activeUser?.profilePic, errors: {} })
                    toast.success("Updated Successfully", commomObj);
                    window.localStorage.setItem("adminimage", JSON.stringify({ name, profilePic }))
                } else {
                    toast.error("Oops!something went wrong", commomObj);
                }
            } catch (err) {
                console.log(err, "errrrrrrrr")
            }
        }

    }
    //===================================upload document==============================================
    const onFileHandler = async (e) => {
        const file = e.target.files[0];
        console.log({ file })
        if (file) {
            if (file.type === "image/jpeg" ||
                file.type === "image/jpg" || file.type === "image/png"
            ) {
                const formData = new FormData();
                formData.append("fileName", file);
                try {
                    const response = await dispatch(UploadDocumnet(formData))
                    if (response?.payload?.data?.code === 200) {
                        toast.success("Upload Successfully", commomObj)
                        updateIstate({ ...istate, profilePic: response?.payload?.data?.url })
                    }
                } catch (error) {
                    toast.error(error?.payload?.data?.message, commomObj)
                    console.error("Error uploading file:", error);
                }


            } else {
                toast.error("Please upload in jpg,jpeg,png,bmp format Only", commomObj);
            }
        }
    };


    return (
        <div>
            <Layout>

                <div className="">
                    <div className="WrapperBox">
                        <div className="Small-Wrapper">
                            <div className="TitleBox">
                                <h4 className="Title">My Account</h4>
                            </div>
                            <div className="PasswordBox">
                                <aside>
                                    <figure>
                                        <span>
                                            <img src={profilePic ? profilePic : require("../../assets/images/Avatar-1.png")} />{" "}
                                        </span>
                                        <div className="UploadOverlay">
                                            <img src={require("../../assets/images/camera.png")} />
                                            <input type="file" onChange={onFileHandler} />
                                        </div>
                                    </figure>
                                </aside>
                                <article>
                                    <div className="CommonForm">
                                        <div className="form-group">
                                            <label>Full name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Full name"
                                                name="name"
                                                value={name}
                                                onChange={inputHandler}
                                            />

                                            <span style={{ color: 'red' }} >{errors?.nameError}</span>
                                        </div>
                                        <div className="form-group">
                                            <label>Email address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Email address"
                                                name="email"
                                                value={email}
                                                onChange={inputHandler}
                                            />

                                            <span style={{ color: 'red' }} >{errors?.emailError}</span>
                                        </div>
                                        <div className="form-group">
                                            <label>Contact number</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Contact number"
                                                name="contact"
                                                value={contact}
                                                onWheel={(e) => e.target.blur()}
                                                onChange={inputHandler}
                                            />
                                            <span style={{ color: 'red' }} >{errors?.contactError}</span>

                                        </div>
                                        <div className="form-group">
                                            <label>Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Address"
                                                name="address"
                                                value={address}
                                                onChange={inputHandler}
                                            />

                                            <span style={{ color: 'red' }} >{errors?.addressError}</span>

                                        </div>
                                        <button className="Button" onClick={saveHandler} disabled={loading}>Save Details</button>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default MyAccount


