import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../commonfiles/Loader'
import { Commonpagination } from '../../commonfiles/Pagination'
import { handledate, commomObj } from '../../utils'
import { toast } from 'react-toastify';
import { Statusmodal } from '../../commonfiles/StatusModal'
import { Deletemodal } from '../../commonfiles/DeleteModal'
import { Link } from 'react-router-dom'
import { reportList } from '../../reduxToolkit/Slices/reportSlices'
import AssignPersonModal from './AssignPersonModal'
import Layout from '../NavSideWrapper'
const initialState = {
    show: false,
    startdate: "",
    enddate: "",
    search: "",
    timeFrame: "",
    openModal: false,
    id: "",
}

function ReportManagement() {
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false)
    const { reportData, loader } = useSelector((state) => state.report)
    console.log(reportData, "reportData")
    const [currentpage, setCurrentpage] = useState(1);   // for pagination
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { show, startdate, enddate, search, timeFrame, id } = istate

    //===================================useeffect==============================================================
    useEffect(() => {
        dispatch(reportList({
            page: "",
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",

        }))
    }, [])
    //..............................pagination................................................................
    const Pagehandler = (pageNumber) => {
        let ser = pageNumber * 10;
        setSerialNo(ser);
        setCurrentpage(pageNumber);
        const data = {
            page: pageNumber,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: ""
        }
        dispatch(reportList(data));

    };
    //==========================================refreshHandler===============================================
    const refreshandler = () => {
        setIstate({ ...istate, startdate: "", enddate: "", search: "", timeFrame: "", })
        dispatch(reportList({
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",

        }))
    }
    //=============================search handler=======================================================
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
                    page: "",
                    startdate: startdate,
                    enddate: enddate,
                    search: search.trim(),
                    timeFrame,
                }
                console.log(data, 'DATAAAAAAAA')
                const res = await dispatch(reportList(data))
                if (res?.payload?.code == 200) {
                    setDisable(false)
                }
                else {
                    setDisable(false)

                }
            }

        }
    }
    //====================================openAssignModal================================================
    const openAssignHandler = (id) => {
        setIstate({ ...istate, openModal: true, id: id })
    }
    return (
        <div>
            <Layout>
                <div className="">
                    <div className="WrapperBox">
                        <div className="Small-Wrapper">
                            <div className="TitleBox">
                                <h4 className="Title">Reported Issue Management</h4>
                                <a href="#" title="Export" className="Button">
                                    Export
                                </a>
                            </div>
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
                                            <th>Report Id</th>
                                            <th>Date of Report</th>
                                            <th>Subject of Report</th>
                                            <th>Addressed To</th>
                                            <th>View Description</th>
                                            <th>User Id</th>
                                            <th>User Name</th>
                                            <th>Status</th>
                                            <th>Assigned To</th>
                                            <th>Date of Closure</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loader ?
                                            reportData?.result?.[0]?.paginationData?.length > 0 ? (
                                                reportData?.result?.[0]?.paginationData?.map((item, i) => {
                                                    console.log('item in report data', item)
                                                    return (
                                                        <tr>
                                                            <td>1</td>
                                                            <td>
                                                                <a>{item?.reportNumber}</a>
                                                            </td>
                                                            <td>{handledate(item?.createdAt)}</td>
                                                            <td>{item?.subject}</td>
                                                            <td>Admin</td>
                                                            <td>
                                                                <div className="Actions">
                                                                    <Link className="Blue"
                                                                        to="/report-management-detail"
                                                                        state={item}
                                                                    >
                                                                        <i className="fa fa-eye" />
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a>U-141</a>
                                                            </td>
                                                            <td>{item?.addressTo}</td>
                                                            <td>
                                                                <span className={item?.status == "PENDING" ? "Red" : "Green"}>{item?.status}</span>
                                                            </td>
                                                            <td>Dipti</td>
                                                            <td>{handledate(item?.updatedAt)}</td>
                                                            <td>
                                                                <div>
                                                                    <a
                                                                        className="Button"
                                                                        title="Assign"
                                                                        onClick={() => openAssignHandler(item?._id)}
                                                                    >
                                                                        Assign
                                                                    </a>
                                                                    <Link
                                                                        className="Button"
                                                                        title="View Notes"
                                                                        to="/notes"
                                                                        state={{ id: item?._id }}
                                                                    >
                                                                        View Notes
                                                                    </Link>
                                                                    <a
                                                                        className="Button"
                                                                        title="Update Status"
                                                                        // href="#"
                                                                        data-toggle="modal"
                                                                        data-target="#StatusModal"
                                                                    >
                                                                        Update Status
                                                                    </a>
                                                                </div>
                                                            </td>
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
                                    {reportData?.result?.[0]?.totalCount?.[0]?.count > 0 && (
                                        <Commonpagination
                                            ActivePage={currentpage}
                                            ItemsCountPerPage={10}
                                            TotalItemsCount={reportData?.result?.[0]?.totalCount?.[0]?.count}
                                            PageRangeDisplayed={5}
                                            Onchange={Pagehandler}
                                        />
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <AssignPersonModal
                    istate={istate}
                    setIstate={setIstate}
                />
            </Layout>
        </div>
    )
}

export default ReportManagement
