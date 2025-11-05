import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { addStatus, projectList } from '../../reduxToolkit/Slices/projectSlices';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import { addNotification, editNotification, notificationList, searchUserList } from '../../reduxToolkit/Slices/notificationSlices';
import Loader from '../../commonfiles/Loader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const initialState = {
    title: "",
    content: "",
    userType: "",
    userId: "",
    searchUser: "",
    sendStatus: "SEND",
    errors: {},
    loading: false,
    initial: false,
    flag: false
}

function AddNotification({ istate, setIstate }) {
    const dispatch = useDispatch();
    const { searchuserData, loader } = useSelector((state) => state.notification)
    const { openModal, type, id, dataa } = istate;
    const [updateStatus, setUpdateStatus] = useState(initialState)
    const { title, content, userType, userId, searchUser, sendStatus, errors, loading, initial, flag } = updateStatus
    console.log(searchuserData, "searchuserData")

    useEffect(() => {
        if (dataa && Object.keys(dataa).length > 0) {
            console.log(dataa, "data")
            setUpdateStatus((prev) => ({ ...prev, title: dataa?.title, content: dataa?.content, userType: dataa?.userType, userId: dataa?.userId, loading: false, initial: true, }))
        }
    }, [dataa])
    useEffect(() => {
        const delay = setTimeout(() => {
            dispatch(searchUserList({ searchUser }));
        }, 1000);
        return () => clearTimeout(delay);
    }, [searchUser])

    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!title?.trim()) {
            formIsValid = false
            error.titleError = "*Required to fill"
        }
        if (!content?.trim()) {
            formIsValid = false
            error.contentError = "*Required to fill"
        }
        if (!userType?.trim()) {
            formIsValid = false
            error.userTypeError = "*Required to fill"
        }
        if (userType == "Single" && !userId?.trim()) {
            formIsValid = false
            error.userIdError = "*Required to fill"
        }
        setUpdateStatus({ ...updateStatus, errors: error })
        return formIsValid
    }

    const saveHandler = async () => {
        let formValid = handleValidation()
        if (formValid) {
            try {
                setUpdateStatus({ ...updateStatus, loading: true })
                const data = { title, content, userType, userId, searchUser, sendStatus: id ? "" : "SEND", id: id ? id : "" }
                const res = id ? await dispatch(editNotification(data)) : await dispatch(addNotification(data))
                if (res?.payload?.code === 200) {
                    toast.success(res?.payload?.message, commomObj);
                    closeHandler()
                    dispatch(notificationList({ page: "", startdate: "", enddate: "", search: "", timeFrame: "", }))
                    setUpdateStatus(initialState)
                } else {
                    toast.error("Oops!something went wrong", commomObj);
                    setUpdateStatus({ ...updateStatus, loading: false, title: "", content: "", userType: "", userId: "", errors: {} })
                }
            } catch (err) {
                console.log(err, "errrrrrrr")
                setUpdateStatus({ ...updateStatus, loading: false, title: "", content: "", userType: "", userId: "", errors: {} })
            }
        }

    }

    const closeHandler = () => {
        setIstate({ ...istate, openModal: false, type: "", id: "", dataa: {} })
        setUpdateStatus(initialState)
    }
    const inputHandler = (e) => {
        const { name, value } = e.target
        setUpdateStatus({ ...updateStatus, [name]: value, errors: {}, flag: false })
    }
 const ckeditorhandler = (content) => {
    setUpdateStatus({ ...updateStatus, content, errors: {} });
}
    const handleSelect = (name, id) => {
        setUpdateStatus({ ...updateStatus, searchUser: name, userId: id, flag: true })
    }

    return (
        <>
            < Modal
                className="ModalBox"
                show={openModal}
                onHide={closeHandler}
            >
                <div className="Category">
                    <Link className="CloseModal" onClick={closeHandler}>
                        ×
                    </Link>
                    <h3>{type} Notification</h3>
                    <div className="form-group">
                        <label>Notification Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Title of Notification"
                            name='title'
                            value={title}
                            onChange={inputHandler}
                        />
                        <span style={{ color: 'red' }} >{errors?.titleError}</span>
                    </div>
                    <div className="form-group">
                        <label>Notification Content</label>
<ReactQuill
    theme="snow"
    value={content}
    onChange={ckeditorhandler}
/>
                        <span style={{ color: 'red' }} >{errors?.contentError}</span>
                    </div>
                    <div className="form-group">
                        <label>Select User Type</label>
                        <select
                            className="form-control"
                            name='userType'
                            value={userType}
                            onChange={inputHandler}
                        >
                            <option value="">--Select--</option>
                            <option value="All">All Users</option>
                            <option value="Single">Single User</option>
                        </select>
                        <span style={{ color: 'red' }} >{errors?.userTypeError}</span>
                    </div>
                    {userType == "Single" && <div className="form-group">
                        <label>Search Users</label>
                        <input
                            type="text"
                            placeholder="Enter User Id"
                            className="form-control"
                            name='searchUser'
                            value={searchUser}
                            onChange={inputHandler}
                        />
                        <span style={{ color: 'red' }} >{errors?.userIdError}</span>
                        {!flag ? <ul>
                            {!loader ?
                                searchuserData?.result?.length > 0 ?
                                    searchuserData?.result?.map((item, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelect(item.userName, item?._id)}
                                        >
                                            {item.userName}
                                        </li>
                                    )) : "No User found" : <Loader item={'200px'} />
                            }
                        </ul> : ""}
                    </div>}
                    <div className="notification-btn">
                        <a
                            className="Button active  mr-2"
                            style={{ pointerEvents: loading ? 'none' : '' }}
                            onClick={saveHandler}
                        >
                            {type == "Edit" ? "Save Changes" : "Send Notification"}
                        </a>
                        <a className="Button" onClick={closeHandler}>
                            Cancel
                        </a>
                    </div>
                </div>



            </Modal>

        </>
    )
}

export default AddNotification

//   <CKEditor
//                             className="form-control"
//                             editor={ClassicEditor}
//                             data={content}
//                             key={initial}
//                             onChange={(event, editor) => ckeditorhandler(event, editor)}
//                         >
//                         </CKEditor>