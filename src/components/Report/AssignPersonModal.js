import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch ,useSelector} from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { commomObj } from '../../utils';
import { toast } from 'react-toastify'
import AddPersonModal from './AddPersonModal';
import { AssignHelp, assignpersonList, reportList } from '../../reduxToolkit/Slices/reportSlices';

const initialState={
    open:false,
    assignTo:"",
    loading:false,
    errors:{},
}

function AssignPersonModal({ istate, setIstate }) {
    const dispatch=useDispatch();
    const { openModal,id } = istate;
    const[output,setOutput]=useState(initialState)
    const{open,assignTo,loading,errors}=output;
    const { assignPersonData, loader } = useSelector((state) => state.report)
    console.log(output, "output")

    const handleClose = () => {
        setIstate({ ...istate, openModal: false })
    }
    const openPersonnModal=()=>{
     setOutput({...output,open:true})
     handleClose();
    }
    useEffect(()=>{
        if(openModal){
            dispatch(assignpersonList())
        }
    },[openModal])

    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!assignTo?.trim()) {
            formIsValid = false
            error.nameError = "*required to fill"           
    }
    setOutput({ ...output, errors: error })
    return formIsValid
}

    const saveHandler=async()=>{
        let formValid = handleValidation()
        if(formValid){
            try{
                setOutput({ ...output, loading:true })
                const data={assignTo,id}
                const res=await dispatch(AssignHelp(data))
                if (res?.payload?.code === 200) {
                    setOutput({ ...output, loading:false,assignTo:"",open:false,errors:{}})
                    toast.success("Added Successfully", commomObj);
                    handleClose()
                    dispatch(reportList({page: "",startdate: "",  enddate: "",search: "",timeFrame: "" }))
                }else{
                    toast.error("Oops!something went wrong", commomObj);
                    setOutput({ ...output, loading:false,errors:{}})
                }    
            }catch(err){
               console.log(err,"errrrr")
               setOutput({ ...output, loading:false,errors:{}})
            }
        }
       
    }

const inputHandler=(e)=>{
   const{name,value}=e.target;
   setOutput({...output,[name]:value})
}
    return (
        <>
            < Modal
                className="ModalBox"
                show={openModal}
                onHide={handleClose}
            >
                <Modal.Body>
                    <div>                       

                        <div className="Category">
                        <Link className="CloseModal" onClick={handleClose}>
                            ×
                        </Link>
                            <h3>Assign to Concerned Person</h3>
                            <a
                                className="Button"
                                data-dismiss="modal"
                               onClick={openPersonnModal}
                            >
                                Add New Person
                            </a>
                            <br />
                            <br />
                            <div className="form-group">
                                <label className="label">Select Person</label>
                                <select 
                                className="form-control"
                                name="assignTo" 
                                value={assignTo}
                                onChange={inputHandler} 
                                >
                                    <option value="">--Select--</option>
                                    {assignPersonData?.askedUser?.length>0&&
                                    assignPersonData?.askedUser?.map((item)=>{
                                        return(
                                            <option value={item._id}>{item?.name}</option>
                                        )
                                    })
                                    }
                                </select>
                                <span style={{ color: 'red' }} >{errors?.nameError}</span>
                            </div>
                            <a className="Button" style={{ pointerEvents: loading ? 'none' : '' }} onClick={saveHandler}>
                                Assign
                            </a>
                        </div>


                    </div>
                </Modal.Body>
            </Modal>
            <AddPersonModal
            output={output}
            setOutput={setOutput}
            istate={istate}
            setIstate={setIstate}
            />
        </>
    )
}

export default AssignPersonModal
