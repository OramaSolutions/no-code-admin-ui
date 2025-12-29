import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../commonfiles/Loader'
import { Commonpagination } from '../../commonfiles/Pagination'
import { handledate, commomObj } from '../../utils'
import { toast } from 'react-toastify';
import { Deletemodal } from '../../commonfiles/DeleteModal'
import { Statusmodal } from '../../commonfiles/StatusModal'
import { Link } from 'react-router-dom'
import { projectList } from '../../reduxToolkit/Slices/projectSlices'
import UpdateModal from './UpdateModal'
import ApprovedModal from './ApprovedModal'
import RemarkModal from './AddRemarkModal'
import Layout from '../NavSideWrapper'
const initialState = {
    startdate: "",
    enddate: "",
    search: "",
    timeFrame: "",
    openModal: false,
    id: "",
    status: "",
    show: false,
    type: "",
    showRemark: false,
    projectName: "",
    model: "",
}


function ProjectManagement({ userId }) {
    console.log(userId, "userId")
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false)
    const { projectData, loader } = useSelector((state) => state.project)
    const [currentpage, setCurrentpage] = useState(1);   // for pagination
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { startdate, enddate, search, timeFrame, id, openModal, status, show, type, showRemark, projectName, model } = istate
    //===================================useeffect=====================================================
    console.log('projectData', projectData)
    useEffect(() => {
        dispatch(projectList({
            userId: userId ? userId : "",
            page: "",
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",

        }))
    }, [])
    //..............................pagination.........................................................
    const Pagehandler = (pageNumber) => {
        let ser = pageNumber * 10;
        setSerialNo(ser);
        setCurrentpage(pageNumber);
        const data = {
            userId: userId ? userId : "",
            page: pageNumber,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: ""
        }
        dispatch(projectList(data));

    };
    //==========================================refreshHandler============================================
    const refreshandler = () => {
        setIstate({ ...istate, startdate: "", enddate: "", search: "", timeFrame: "", })
        dispatch(projectList({
            userId: userId ? userId : "",
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",

        }))
    }
    //=============================search handler===================================================
    const addinputhandler = (e) => {
        const { name, value } = e.target
        setIstate({ ...istate, [name]: value })
    }
    const applyhandler = async () => {
        if (startdate.trim() == '' && enddate.trim() == '' && search.trim() == '' && timeFrame.trim() == '') {
            toast.error("Please select the value", commomObj);
        }
        if (startdate.trim() == '' && enddate.trim() != '' && !search && !timeFrame) {
            toast.error("Please select the start date", commomObj);
        }
        if (startdate.trim() != '' && enddate.trim() == '' && !search && !timeFrame) {
            toast.error("Please select the end date", commomObj);
        }
        if (startdate && enddate || search || timeFrame) {
            const newstartdate = new Date(startdate)
            const newenddate = new Date(enddate)
            if (newstartdate.getTime() >= newenddate.getTime()) {
                toast.error("End date must be greater than start date", commomObj);
            } else {
                setDisable(true)
                const data = {
                    userId: userId ? userId : "",
                    page: "",
                    startdate: startdate,
                    enddate: enddate,
                    search: search.trim(),
                    timeFrame,
                }
                console.log(data, 'DATAAAAAAAA')
                const res = await dispatch(projectList(data))
                if (res?.payload?.code == 200) {
                    setDisable(false)
                }
                else {
                    setDisable(false)

                }
            }

        }
    }
    //=====================================Open add/close modal===================================
    const openUpdateModal = (id, status) => {
        setIstate({ ...istate, openModal: true, id: id, status: status })
    }
    //===================================open submission modal===========================================
    const openSubmission = (id, type) => {
        setIstate({ ...istate, id: id, type: type, show: true })
    }
    //======================================open remark modal========================================
    const openRemark = (id, projectName, model) => {
        setIstate({ ...istate, id: id, showRemark: true, model: model, projectName: projectName })
    }
    return (
        <div>
            <Layout>
                <div>
                    <div className={userId ? "" : "WrapperBox"}>
                        <div className="Small-Wrapper">
                            {userId ? "" : <div className="TitleBox">
                                <h4 className="Title">Project Management</h4>
                                <a href="#" title="Export" className="Button">
                                    Export
                                </a>
                            </div>}
                            <div className="Filter">
                                <div className="form-group">
                                    <label>Search</label>
                                    <input type="search"
                                        className="form-control"
                                        placeholder="Enter id or project name"
                                        name='search'
                                        value={search}
                                        onChange={addinputhandler}
                                        disabled={startdate || enddate || timeFrame}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>From Date</label>
                                    <input type="date" className="form-control"
                                        name='startdate'
                                        value={startdate}
                                        onChange={addinputhandler}
                                        disabled={search || timeFrame}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>To Date</label>
                                    <input type="date" className="form-control"
                                        name='enddate'
                                        value={enddate}
                                        onChange={addinputhandler}
                                        min={startdate}
                                        disabled={search || timeFrame}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Select From</label>
                                    <select className="form-control"
                                        name='timeFrame'
                                        value={timeFrame}
                                        onChange={addinputhandler}
                                        disabled={startdate || enddate || search}>
                                        <option value="">Select </option>
                                        <option value="Today">Today</option>
                                        <option value="Week">This Week</option>
                                        <option value="Month">This Month</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>&nbsp;</label>
                                    <button className="Button mr-2" disabled={disable} onClick={applyhandler}>Apply</button>
                                    <button className="Button Cancel" disabled={disable} onClick={refreshandler}>
                                        <i className="fa fa-refresh" />
                                    </button>
                                    {"  "}
                                </div>
                            </div>
                            <div className="TableList">
                                <table style={{ width: "120%" }}>
                                    <thead>
                                        <tr>
                                            <th>Sr.No.</th>
                                            <th>Project Id</th>
                                            <th>Project Name</th>
                                            <th>Model Name</th>
                                            {/* <th>Version Id</th> */}
                                            <th>Version No.</th>
                                            <th>Date of Creation</th>
                                            {/* <th>Status</th> */}
                                            <th>Date of Closure</th>
                                            <th>User Id</th>
                                            <th>User Name</th>
                                            {/* <th>Update Status</th>
                                            <th>Submission Status</th>
                                            <th>Action</th> */}
                                            {/* <th>Add/View Remark</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loader ?
                                            projectData?.result?.[0]?.paginationData?.length > 0 ? (
                                                projectData?.result?.[0]?.paginationData?.map((item, i) => {
                                                    return (
                                                        <tr>
                                                            <td>{i + 1 + serialNo - 10}</td>
                                                            <td>
                                                                <Link to='/project-details' state={item}>{item?.project_number}</Link>
                                                            </td>
                                                            <td>{item?.name}</td>
                                                            <td>{item?.model}</td>
                                                            {/* <td>
                                                                <a>V-141</a>
                                                            </td> */}
                                                            <td>
                                                                <Link to="/project-details" state={item}>{item?.versionNumber}</Link>
                                                            </td>
                                                            <td>{handledate(item?.createdAt)}</td>
                                                            {/* <td>
                                                                <span className={item?.projectStatus == "OPEN" ? "Green" : "Red"}>{item?.projectStatus}</span>
                                                            </td> */}
                                                            <td>{handledate(item?.updatedAt)}</td>
                                                            <td>
                                                                {item?.userData?.user_number}
                                                            </td>
                                                            <td>{item?.userData?.name}</td>
                                                            {/* <td>
                                                                <a
                                                                    className="Button"
                                                                    title="Update Status"
                                                                    onClick={() => openUpdateModal(item?._id, item?.projectStatus)}
                                                                >
                                                                    Update Status
                                                                </a>
                                                            </td> */}
                                                            {/* <td>
                                                                <span className="Red">Pending</span>
                                                            </td> */}
                                                            {/* <td>
                                                                <div className="Actions">
                                                                    {item?.approvedStatus == "ACCEPT" ?
                                                                        <button title="Approve" className="Green" >
                                                                            Approved
                                                                        </button> : item?.approvedStatus == "REJECT" ?
                                                                            <button title="Approve" className="Red" >
                                                                                Rejected
                                                                            </button> : <>
                                                                                <button title="Approve" className="Green" onClick={() => openSubmission(item?._id, "Approved")}>
                                                                                    Approve Submission
                                                                                </button>
                                                                                <button title="Reject" className="Red" onClick={() => openSubmission(item?._id, "Reject")}>
                                                                                    Reject Submission
                                                                                </button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </td> */}
                                                            {/* <td>
                                                                <div className="Actions">
                                                                    <button
                                                                        className="Green"
                                                                        onClick={() => openRemark(item?._id, item?.name, item?.model)}
                                                                    >
                                                                        Add/View Remark
                                                                    </button>
                                                                </div>
                                                            </td> */}
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="12">
                                                        <p>No Data found.</p>
                                                    </td>
                                                </tr>
                                            ) : <Loader></Loader>}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination">
                                <ul>
                                    {projectData?.result?.[0]?.totalCount?.[0]?.count > 0 && (
                                        <Commonpagination
                                            ActivePage={currentpage}
                                            ItemsCountPerPage={10}
                                            TotalItemsCount={projectData?.result?.[0]?.totalCount?.[0]?.count}
                                            PageRangeDisplayed={5}
                                            Onchange={Pagehandler}
                                        />
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <UpdateModal
                    istate={istate}
                    setIstate={setIstate}
                    userId={userId}
                />
                <ApprovedModal
                    istate={istate}
                    setIstate={setIstate}
                    userId={userId}
                />
                <RemarkModal
                    istate={istate}
                    setIstate={setIstate}
                    userId={userId}
                />
            </Layout>
        </div>
    )
}

export default ProjectManagement
