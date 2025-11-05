import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify'
import { addRemark,projectList } from '../../reduxToolkit/Slices/projectSlices';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const initialState = {
    visible: false,
    notes: "",
    errors: {},
    loading:false,
}

function RemarkModal({istate,setIstate,userId}) {
    const{id,projectName,model,showRemark}=istate;
    const dispatch=useDispatch();
    const [adminRemark, setadminRemark] = useState(initialState)
    const { visible, notes, errors,loading } = adminRemark

    const ckeditorhandler = (content, editor) => {
        setadminRemark({...adminRemark,notes:content})
    }
    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!notes?.trim()) {
            formIsValid = false
            error.nameError = "*required to fill"
        }
        setadminRemark({ ...adminRemark, errors: error })
        return formIsValid
    }

    const saveHandler=async()=>{
        let formValid = handleValidation()
        if(formValid){
            try{
                setadminRemark({ ...adminRemark, loading:true })
                const data={projectId:id,notes,visible}
                const res=await dispatch(addRemark(data))
                if (res?.payload?.code === 200) {
                    setadminRemark({ ...adminRemark, loading:false,notes:"",errors:{},visible:false})
                    toast.success("Added Successfully", commomObj);
                    handleClose()
                   dispatch(projectList({ userId:userId?userId:"",page:"",startdate: "",enddate: "",search: "",timeFrame: "",}))
                }else{
                    toast.error("Oops!something went wrong", commomObj);
                    setadminRemark({ ...adminRemark, loading:false,notes:"",errors:{},visible:true})
                }    
            }catch(err){
               console.log(err,"errrrrrrr")
               setadminRemark({ ...adminRemark, loading:false,notes:"",errors:{},visible:true})
            }
        }
       
    }

const handleClose=()=>{
    setIstate({...istate,id:"",projectName:"",model:"",showRemark:""})
}

    return (
        <>
            < Modal
                className="ModalBox"
                show={showRemark}
                onHide={handleClose}
            >
                <Modal.Body>
                    <div className="Category">
                        <a className="CloseModal" onClick={handleClose}>
                            ×
                        </a>
                        <h3>{projectName}</h3>
                        <h5>Model:{model}</h5>
                        <p>Admin Remarks</p>
                        <div className="form-group">
                            <label className="label">Notes:</label>
                            <ReactQuill
                                theme="snow"
                                value={notes}
                                onChange={(content, editor) => ckeditorhandler(content, editor)}
                            // style={{ width: '500px', height: '50px'}}
                            />
                             <span style={{ color: 'red' }} >{errors?.nameError}</span>
                        </div>
                        <aside className="file-info-checkbox">
                            <div className="form-group1">
                                <label className="CheckBox">
                                    It should be visible to users
                                    <input 
                                    type="checkbox"
                                    name='visible'
                                    checked={visible}
                                    onChange={(e)=>setadminRemark({...adminRemark,visible:e.target.checked})} 
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                        </aside>
                        <br />
                        <a onClick={saveHandler} style={{ pointerEvents: loading ? 'none' : '' }} className="Button">
                            Save Remark
                        </a>
                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}

export default RemarkModal
