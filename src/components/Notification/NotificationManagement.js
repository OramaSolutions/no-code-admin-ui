import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../commonfiles/Loader'
import { Commonpagination } from '../../commonfiles/Pagination'
import { handledate, commomObj } from '../../utils'
import { toast } from 'react-toastify';
import { Deletemodal } from '../../commonfiles/DeleteModal'
import { deleteNotification, notificationList, resendNotification } from '../../reduxToolkit/Slices/notificationSlices'
import AddNotification from './AddNotification'
import Layout from '../NavSideWrapper'
const initialState = {
    startdate: "",
    enddate: "",
    search: "",
    timeFrame: "",
    openModal: false,
    id: "",
    type: "",
    dataa: {},
    modal: false,
    isloading: false,
}

function NotificationManagement() {
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false)
    const { notificationData, loader } = useSelector((state) => state.notification)
    const [currentpage, setCurrentpage] = useState(1);   // for pagination
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { startdate, enddate, search, timeFrame, id, openModal, type, dataa, modal, isloading } = istate

    //===================================useeffect=====================================================
    useEffect(() => {
        dispatch(notificationList({
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
            page: pageNumber,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: ""
        }
        dispatch(notificationList(data));

    };
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
                    page: "",
                    startdate: startdate,
                    enddate: enddate,
                    search: search.trim(),
                    timeFrame,
                }
                const res = await dispatch(notificationList(data))
                if (res?.payload?.code == 200) {
                    setDisable(false)
                }
                else {
                    setDisable(false)

                }
            }

        }
    }

    //==========================================refreshHandler============================================
    const refreshandler = () => {
        setIstate({ ...istate, startdate: "", enddate: "", search: "", timeFrame: "", })
        dispatch(notificationList({
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",
        }))
    }
    //======================================open modal============================================
    const openHandler = (type, item, id) => {
        setIstate({ ...istate, openModal: true, id: id, type: type, dataa: item || {} })
    }
    const handleClose = () => {
        setIstate({ ...istate, modal: false, id: '' })
    }

    const DeleteShowhandler = (id) => {
        setIstate({ ...istate, modal: true, id: id })
    }

    const handleDelete = async () => {
        setIstate({ ...istate, isloading: true })
        try {
            const data = { id: id }
            const res = await dispatch(deleteNotification(data))
            if (res?.payload?.code === 200) {
                setIstate({ ...istate, modal: false, id: '', isloading: false })
                toast.success(" Deleted Successfully", commomObj);
                let res = await dispatch(notificationList({
                    page: currentpage,
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }))
                if (res?.payload?.result?.[0]?.paginationData?.length === 0 && currentpage > 1) {
                    const lastPage = currentpage - 1;
                    setCurrentpage(lastPage);
                    setSerialNo((lastPage) * 10);
                    dispatch(notificationList({
                        page: lastPage, startdate: "", enddate: "", search: "", timeFrame: "",
                    }));
                }
            } else {
                toast.error(res?.payload?.message, commomObj);
            }
        } catch (err) {
            console.log('handledelete error---', err)
            setIstate({ ...istate, isloading: false })
        }
    }
    //================================resend handler=========================================================
    const resendHandler = async (id) => {
        try {
            setIstate({ ...istate, isloading: true })
            const res = await dispatch(resendNotification({ id: id }))
            if (res?.payload?.code === 200) {
                toast.success(res?.payload?.message, commomObj);
                dispatch(notificationList({
                    page: currentpage,
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }))
                setIstate({ ...istate, isloading: false })
            } else {
                toast.error(res?.payload?.message, commomObj);
                setIstate({ ...istate, isloading: true })
            }
        } catch (err) {
            console.log(err, "errr")
            setIstate({ ...istate, isloading: true })
        }
    }
    return (
        <div>
            <Layout>
                <div className="">
                    <div className="WrapperBox">
                        <div className="Small-Wrapper wrapper-contant">
                            <div className="TitleBox">
                                <h4 className="Title">Notifications Management</h4>
                                <a
                                    title="Send Message"
                                    className="Button"
                                    onClick={() => openHandler('Add New')}
                                >
                                    Send Message
                                </a>
                            </div>
                            <div className="Filter">
                                <div className="form-group">
                                    <label>Search</label>
                                    <input type="search"
                                        className="form-control"
                                        placeholder="Enter id or name"
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
                            <div className="management">
                                <div className="TableList">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th>Title</th>
                                                <th>Message</th>
                                                <th>Sent On</th>
                                                <th>User Type</th>
                                                <th>No Of User</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!loader ?
                                                notificationData?.result?.[0]?.paginationData?.length > 0 ? (
                                                    notificationData?.result?.[0]?.paginationData?.map((item, i) => {
                                                        return (
                                                            <tr>
                                                                <td>{i + serialNo - 10 + 1}</td>
                                                                <td>{item?.title}</td>
                                                                <td>
                                                                    <p style={{ maxWidth: "225px", whiteSpace: "normal" }} dangerouslySetInnerHTML={{ __html: item?.content }}></p>
                                                                </td>
                                                                <td>{handledate(item?.createdAt)}</td>
                                                                <td>{item?.userType}</td>
                                                                <td>{item?.users?.length}</td>
                                                                <td>
                                                                    <div className="Actions">
                                                                        <a
                                                                            title="Edit"
                                                                            className="Green"
                                                                            onClick={() => openHandler('Edit', item, item?._id)}
                                                                        >
                                                                            <i className="fa fa-pencil" aria-hidden="true" />
                                                                        </a>
                                                                        <a
                                                                            title="Delete"
                                                                            className="Red"
                                                                            onClick={() => DeleteShowhandler(item?._id)}
                                                                        >
                                                                            <i className="fa fa-trash" />
                                                                        </a>
                                                                        <button title="Resend" onClick={() => resendHandler(item?._id)}>Resend</button>
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
                                        {notificationData?.result?.[0]?.totalCount?.[0]?.count > 0 && (
                                            <Commonpagination
                                                ActivePage={currentpage}
                                                ItemsCountPerPage={10}
                                                TotalItemsCount={notificationData?.result?.[0]?.totalCount?.[0]?.count}
                                                PageRangeDisplayed={5}
                                                Onchange={Pagehandler}
                                            />
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AddNotification
                    istate={istate}
                    setIstate={setIstate}
                />
                <Deletemodal
                    onOpen={modal}
                    onClose={handleClose}
                    loading={isloading}
                    message='Notification'
                    onDelete={handleDelete}
                />
            </Layout>
        </div>
    )
}

export default NotificationManagement
