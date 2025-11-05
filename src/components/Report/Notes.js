import React, { useEffect, useState } from 'react'
import Sidenav from '../Sidenav'
import Header from '../Header'
import { useSelector, useDispatch } from 'react-redux'
import { notesList } from '../../reduxToolkit/Slices/reportSlices'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import Loader from '../../commonfiles/Loader'
import AddNotesModal from './AddNotesModal'

const initialState={
    openModal:false,
    id:"",
}

function Notes() {
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { notesData, loader } = useSelector((state) => state.report)
    const[istate,updateIstate]=useState(initialState)
    const{openModal}=istate;
    console.log(notesData, "notesData")
  
    useEffect(() => {
        dispatch(notesList({ helpId: state?.id }))
    }, [])

    const openNotesModal=()=>{
        updateIstate({...istate,openModal:true,id:state?.id})
    }

    return (
        <div>
            <Sidenav />
            <Header />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="">
                        <div className="InformationBox">
                            <div className="TitleBox">
                                <h4 className="Title">Resolution Notes</h4>
                                <a className="Button" onClick={openNotesModal}>
                                    Add Notes
                                </a>
                            </div>
                            {!loader ?
                            notesData?.result?.length > 0 ?
                                notesData?.result?.map((item) => {
                                    return (
                                        <div className="Information">
                                            <article>
                                                <aside>
                                                    <p>
                                                        <strong>Date &amp; Time</strong> <span>{moment(item?.createdAt).format('YYYY-MM-DD')},{moment(item?.createdAt).format('h:mm A')}</span>
                                                    </p>
                                                    <p>
                                                        <strong>Notes</strong>
                                                        <span>
                                                        <p dangerouslySetInnerHTML={{__html:item?.note}}></p> 
                                                        </span>
                                                    </p>
                                                </aside>
                                            </article>
                                        </div>
                                    )

                                })
                                : (
                                    <tr>
                                        <td colSpan="12">
                                            <p>No Data found.</p>
                                        </td>
                                    </tr>
                                ) : <Loader></Loader>}
                        </div>
                    </div>
                </div>
            </div>
            <AddNotesModal
            istate={istate}
            setIstate={updateIstate}
            />
        </div>
    )
}

export default Notes
