import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { notesList, AddNotes } from '../../reduxToolkit/Slices/reportSlices'

const initialState = {
    notedate: "",
    notetime: "",
    notes: "",
    errors: {},
    loading: false,
}


function AddNotesModal({ istate, setIstate }) {
    const { openModal, id } = istate;
    const dispatch = useDispatch();
    const [adminNotes, setAdminNotes] = useState(initialState)
    const { notedate, notetime, notes, errors, loading } = adminNotes

    const handleClose = () => {
        setIstate({ ...istate, openModal: false})
        setAdminNotes(initialState)
    }

    const ckeditorhandler = (content, editor) => {
        setAdminNotes({ ...adminNotes, notes: content })
    }

    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!notedate?.trim()) {
            formIsValid = false
            error.DateError = "*required to fill"
        } 
        if (!notetime?.trim()) {
            formIsValid = false
            error.TimeError = "*required to fill"
        } 
        if (!notes?.trim()) {
            formIsValid = false
            error.NotesError = "*required to fill"
        } 
        
        setAdminNotes({ ...adminNotes, errors: error })
        return formIsValid
    }

    const saveHandler = async () => {
        let formValid = handleValidation()
        if (formValid) {
            try {
                const data = { helpId: id, date: notedate, time: notetime, note: notes, }
                const res = await dispatch(AddNotes(data))
                if (res?.payload?.code === 200) {
                    toast.success("Updated Successfully", commomObj);
                    handleClose()
                    dispatch(notesList({ helpId: id }))
                } else {
                    toast.error("Oops!something went wrong", commomObj);
                    setIstate({ ...istate, loading: false })
                }
            } catch (err) {
                console.log(err, "errrrrrrr")
                setIstate({ ...istate, loading: false })
            }
        }
    }
    const inputHandler = (e) => {
        const { name, value } = e.target
        setAdminNotes({ ...adminNotes, [name]: value })
    }

    return (
        <div>
            < Modal
                className="ModalBox"
                show={openModal}
                onHide={handleClose}
            >
                <Modal.Body>
                    <div className='Category'>
                        <h3>Add New Notes</h3>
                        <div className="form-group">
                            <label className="label">Select Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="notedate"
                                value={notedate}
                                onChange={inputHandler}
                            />
                            <span style={{ color: 'red' }} >{errors?.DateError}</span>
                        </div>
                        <div className="form-group">
                            <label className="label">Select Date</label>
                            <input
                                type="time"
                                className="form-control"
                                name="notetime"
                                value={notetime}
                                onChange={inputHandler}
                            />
                            <span style={{ color: 'red' }} >{errors?.TimeError}</span>
                        </div>
                        <div className="form-group">
                            <label className="label">Notes:</label>
                            <ReactQuill
                                theme="snow"
                                value={notes}
                                onChange={(content, editor) => ckeditorhandler(content, editor)}
                            />
                            <span style={{ color: 'red' }} >{errors?.NotesError}</span>
                        </div>
                        <div className='LogOutModalArea'>
                            <div className='Buttons'>
                                <Link className='CancelBtn' data-dismiss="modal" onClick={handleClose} > Cancel</Link>
                                <Link className='ConfirmBtn' onClick={saveHandler} style={{ pointerEvents: loading ? 'none' : '' }}>Confirm</Link>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AddNotesModal
