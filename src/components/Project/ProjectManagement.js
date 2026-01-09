import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../commonfiles/Loader'
import { Commonpagination } from '../../commonfiles/Pagination'
import { handledate, commomObj } from '../../utils'
import { toast } from 'react-toastify';
import { Deletemodal } from '../../commonfiles/DeleteModal'
import { Statusmodal } from '../../commonfiles/StatusModal'
import { Link, useNavigate } from 'react-router-dom'
import { projectList } from '../../reduxToolkit/Slices/projectSlices'
import UpdateModal from './UpdateModal'
import AddNotification from '../Notification/AddNotification'
import ApprovedModal from './ApprovedModal'
import RemarkModal from './AddRemarkModal'
import Layout from '../NavSideWrapper'
import { FiBell } from "react-icons/fi";
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
    dataa: {},
}


function ProjectManagement({ userId }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [disable, setDisable] = useState(false)
    const [openDropdown, setOpenDropdown] = useState(null);
    const { projectData, loader } = useSelector((state) => state.project)
    const [currentpage, setCurrentpage] = useState(1);   // for pagination
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { startdate, enddate, search, timeFrame, id, openModal, status, show, type, showRemark, projectName, model } = istate
    //===================================useeffect=====================================================
    // console.log('projectData', projectData)

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
    const rawProjects = projectData?.result?.[0]?.paginationData || [];
  

    // group by project name + model + user (important!)


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

    useEffect(() => {
        const close = () => setOpenDropdown(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);


    return (
        <div>
            <Layout>
                <div>
                    <div className={userId ? "" : "WrapperBox"}>
                        <div className="Small-Wrapper">
                            {userId ? "" : <div className="TitleBox">
                                <h4 className="Title">Project Management</h4>
                                {/* <a href="#" title="Export" className="Button">
                                    Export
                                </a> */}
                            </div>}
                            <div className="Filter">

                                <div className="form-group">
                                    <label>Project Name or User Name</label>
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search by project name or user name"
                                        name="search"
                                        value={search}
                                        onChange={addinputhandler}
                                    /></div>
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
                                    <input type="date"
                                        className="form-control"
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
                                            {/* <th>Project Id</th> */}
                                            <th>Project Name</th>
                                            <th>Model Name</th>
                                            {/* <th>Version Id</th> */}
                                            <th>Version No.</th>
                                            <th>Date of Creation</th>
                                            {/* <th>Status</th> */}
                                            <th>Date of Closure</th>
                                            <th>User Id</th>
                                            <th>User Name</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loader ? (
                                            rawProjects.length > 0 ? (
                                                rawProjects.map((project, i) => (
                                                    <tr key={i}>
                                                        <td>{i + 1 + serialNo - 10}</td>

                                                        {/* Project Name */}
                                                        <td>
                                                            <strong>{project.projectName}</strong>
                                                        </td>

                                                        {/* Model */}
                                                        <td>{project.model}</td>

                                                        {/* Versions */}
                                                        <td className="relative text-black">
                                                            {/* Dropdown button */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenDropdown(
                                                                        openDropdown === project._id ? null : project._id
                                                                    )
                                                                }}
                                                                className="w-40 text-gray-800 px-3 py-2 text-sm border rounded-md bg- text-left hover:bg-gray-500"
                                                            >
                                                                Select Version
                                                            </button>

                                                            {/* Dropdown menu */}
                                                            {openDropdown === project._id && (
                                                                <div className="absolute z-20 mt-1 w-40 rounded-md border bg-black shadow-lg">
                                                                    {project.versions.map((v) => (
                                                                        <div
                                                                            key={v._id}
                                                                            className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-700"
                                                                        >
                                                                            {/* Version click → navigate */}
                                                                            <span
                                                                                className="cursor-pointer text-gray-800 hover:text-blue-300"
                                                                                onClick={() => {
                                                                                    setOpenDropdown(null);
                                                                                    navigate("/project-details", {
                                                                                        state: v.fullItem,
                                                                                    });
                                                                                }}
                                                                            >
                                                                                v{v.versionNumber}
                                                                            </span>

                                                                            {/* Bell click → notify */}
                                                                            <FiBell
                                                                                className="cursor-pointer text-gray-500 hover:text-indigo-300"
                                                                                title="Send notification"
                                                                                onClick={(e) => {
                                                                                //   console.log(project)
                                                                                    e.stopPropagation(); // 🔥 critical
                                                                                    setOpenDropdown(null);
                                                                                    setIstate({
                                                                                        ...istate,
                                                                                        openModal: true,
                                                                                        dataa: {
                                                                                            recipientId: project.userData?._id || null,
                                                                                            projectId: v._id, // ✅ VERSION ID
                                                                                            projectName: project.projectName,
                                                                                            userName:project.userData?.userName || null,
                                                                                        },
                                                                                    });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>


                                                        {/* Created At (earliest) */}
                                                        <td>{handledate(project.createdAt)}</td>

                                                        {/* Updated At (latest) */}
                                                        <td>{handledate(project.updatedAt)}</td>

                                                        {/* User Id */}
                                                        <td>{project.userData?.user_number}</td>

                                                        {/* User Name */}
                                                        <td>{project.userData?.name}</td>
                                                       
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="12">No Data found.</td>
                                                </tr>
                                            )
                                        ) : (
                                            <Loader />
                                        )}
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
                {/* <UpdateModal
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
                /> */}
                <AddNotification
                    istate={istate}
                    setIstate={setIstate}
                />
            </Layout>
        </div>
    )
}

export default ProjectManagement
