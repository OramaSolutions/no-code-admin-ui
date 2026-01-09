import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { commomObj } from "../../utils";
import { addNotification, searchUserList } from "../../reduxToolkit/Slices/notificationSlices";
import Loader from "../../commonfiles/Loader";

const initialState = {
    title: "",
    message: "",
    recipientId: "",
    searchUser: "",
    projectId: "",
    projectName: "",
    errors: {},
    type: "info",
    loading: false,
};

function AddNotification({ istate, setIstate }) {
    const dispatch = useDispatch();
    const { searchuserData, loader } = useSelector((state) => state.notification);
    const { openModal, dataa } = istate;

    const [state, setState] = useState(initialState);
    const {
        title,
        message,
        recipientId,
        searchUser,
        projectId,
        projectName,
        errors,
        type,
        loading,
    } = state;



    // Pre-fill project if opened from project context
    useEffect(() => {
        if (dataa?.projectId) {
            setState((prev) => ({
                ...prev,
                recipientId: dataa.recipientId,
                projectId: dataa.projectId,
                projectName: dataa.projectName,
                searchUser: dataa.userName
            }));
        }
    }, [dataa]);

    // Debounced user search
    useEffect(() => {
        if (!searchUser) return;

        const timer = setTimeout(() => {
            dispatch(searchUserList({ searchUser }));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchUser, dispatch]);

    // Validation
    const validate = () => {
        const errs = {};
        if (!title.trim()) errs.title = "Title is required";
        if (!message.trim()) errs.message = "Message is required";
        // if (!recipientId) errs.recipientId = "Please select a user";
        // if (!projectId) errs.projectId = "Project is missing";

        setState((prev) => ({ ...prev, errors: errs }));
        return Object.keys(errs).length === 0;
    };

    // Submit
    const saveHandler = async () => {
        if (!validate()) return;

        setState((prev) => ({ ...prev, loading: true }));

        const res = await dispatch(
            addNotification({
                recipientId: recipientId || null,
                projectId: projectId || null,
                projectName: projectName || null,
                title,
                message,
                type,
            })
        );

        if (res?.payload?.notification) {
            toast.success("Notification sent successfully", commomObj);
            closeHandler();
        } else {
            toast.error("Failed to send notification", commomObj);
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const closeHandler = () => {
        setIstate({ ...istate, openModal: false, dataa: {} });
        setState(initialState);
    };

    const handleSelectUser = (user) => {
        setState((prev) => ({
            ...prev,
            recipientId: user._id,
            searchUser: user.userName,
            errors: {},
        }));
    };

    return (
        <Modal className="ModalBox" show={openModal} onHide={closeHandler}>
            <div className="Category">
                <Link className="CloseModal" onClick={closeHandler}>
                    ×
                </Link>

                <h3>Send Notification</h3>

                {/* Title */}
                <div className="form-group">
                    <label>Notification Title</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) =>
                            setState((prev) => ({
                                ...prev,
                                title: e.target.value,
                                errors: {},
                            }))
                        }
                    />
                    {errors.title && <span className="text-danger">{errors.title}</span>}
                </div>
                {/* Notification Type */}
                <div className="form-group">
                    <label>Notification Type</label>
                    <select
                        className="form-control"
                        value={type}
                        onChange={(e) =>
                            setState((prev) => ({
                                ...prev,
                                type: e.target.value,
                            }))
                        }
                    >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                    </select>
                </div>


                {/* Message */}
                <div className="form-group">
                    <label>Notification Message</label>
                    <ReactQuill
                        theme="snow"
                        value={message}
                        onChange={(val) =>
                            setState((prev) => ({
                                ...prev,
                                message: val,
                                errors: {},
                            }))
                        }
                    />
                    {errors.message && <span className="text-danger">{errors.message}</span>}
                </div>

                {/* User search */}
                <div className="form-group">
                    <label>Search User</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by username"
                        value={searchUser}
                        onChange={(e) =>
                            setState((prev) => ({
                                ...prev,
                                searchUser: e.target.value,
                            }))
                        }
                    />
                    {errors.recipientId && (
                        <span className="text-danger">{errors.recipientId}</span>
                    )}

                    {searchUser && (
                        <ul className="user-search-list">
                            {!loader ? (
                                searchuserData?.result?.length > 0 ? (
                                    searchuserData.result.map((user) => (
                                        <li
                                            key={user._id}
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            {user.userName}
                                        </li>
                                    ))
                                ) : (
                                    <li>No users found</li>
                                )
                            ) : (
                                <Loader item="150px" />
                            )}
                        </ul>
                    )}
                </div>

                {/* Buttons */}
                <div className="notification-btn">
                    <button
                        className="Button active mr-2"
                        disabled={loading}
                        onClick={saveHandler}
                    >
                        {loading ? "Sending..." : "Send Notification"}
                    </button>
                    <button className="Button" onClick={closeHandler}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default AddNotification;
