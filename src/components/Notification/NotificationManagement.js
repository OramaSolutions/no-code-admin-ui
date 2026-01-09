import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../commonfiles/Loader'
import { Commonpagination } from '../../commonfiles/Pagination'
import { handledate, commomObj } from '../../utils'
import { toast } from 'react-toastify';
import { Deletemodal } from '../../commonfiles/DeleteModal'
import { deleteNotification, adminNotificationList } from '../../reduxToolkit/Slices/notificationSlices'
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
        dispatch(
            adminNotificationList({
                page: 1,
                limit: 10,
            })
        );
    }, [dispatch]);

    //..............................pagination.........................................................
    const Pagehandler = (pageNumber) => {
        setCurrentpage(pageNumber);
        setSerialNo(pageNumber * 10);

        dispatch(
            adminNotificationList({
                page: pageNumber,
                limit: 10,
                search,
            })
        );
    };

    //=============================search handler===================================================
    const addinputhandler = (e) => {
        const { name, value } = e.target
        setIstate({ ...istate, [name]: value })
    }
    
    // const applyhandler = async () => {
    //     if (startdate.trim() == '' && enddate.trim() == '' && search.trim() == '' && timeFrame.trim() == '') {
    //         toast.error("Please select the value", commomObj);
    //     }
    //     if (startdate.trim() == '' && enddate.trim() != '' && !search && !timeFrame) {
    //         toast.error("Please select the start date", commomObj);
    //     }
    //     if (startdate.trim() != '' && enddate.trim() == '' && !search && !timeFrame) {
    //         toast.error("Please select the end date", commomObj);
    //     }
    //     if (startdate && enddate || search || timeFrame) {
    //         const newstartdate = new Date(startdate)
    //         const newenddate = new Date(enddate)
    //         if (newstartdate.getTime() >= newenddate.getTime()) {
    //             toast.error("End date must be greater than start date", commomObj);
    //         } else {
    //             setDisable(true)
    //             const data = {
    //                 page: "",
    //                 startdate: startdate,
    //                 enddate: enddate,
    //                 search: search.trim(),
    //                 timeFrame,
    //             }
    //             const res = await dispatch(notificationList(data))
    //             if (res?.payload?.code == 200) {
    //                 setDisable(false)
    //             }
    //             else {
    //                 setDisable(false)

    //             }
    //         }

    //     }
    // }

    //==========================================refreshHandler============================================
    
    const applyhandler = () => {
        dispatch(
            adminNotificationList({
                page: 1,
                limit: 10,
                search: search.trim(),
            })
        );
    };

    const refreshandler = () => {
        setIstate({ ...istate, startdate: "", enddate: "", search: "", timeFrame: "", })
        dispatch(adminNotificationList({
            page: 1,
            limit: 10,
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
                let res = await dispatch(adminNotificationList({
                    page: 1,
                    limit: 10,
                }))
                if (res?.payload?.result?.[0]?.paginationData?.length === 0 && currentpage > 1) {
                    const lastPage = currentpage - 1;
                    setCurrentpage(lastPage);
                    setSerialNo((lastPage) * 10);
                    dispatch(adminNotificationList({
                        page: 1,
                        limit: 10,
                    }))
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
    // const resendHandler = async (id) => {
    //     try {
    //         setIstate({ ...istate, isloading: true })
    //         const res = await dispatch(resendNotification({ id: id }))
    //         if (res?.payload?.code === 200) {
    //             toast.success(res?.payload?.message, commomObj);
    //             dispatch(notificationList({
    //                 page: currentpage,
    //                 startdate: "",
    //                 enddate: "",
    //                 search: "",
    //                 timeFrame: "",
    //             }))
    //             setIstate({ ...istate, isloading: false })
    //         } else {
    //             toast.error(res?.payload?.message, commomObj);
    //             setIstate({ ...istate, isloading: true })
    //         }
    //     } catch (err) {
    //         console.log(err, "errr")
    //         setIstate({ ...istate, isloading: true })
    //     }
    // }
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
                                                <th>Project</th>
                                                <th>Status</th>
                                                <th>User</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!loader ? (
                                                notificationData?.data?.length > 0 ? (
                                                    notificationData.data.map((item, i) => {
                                                        const userLabel = item.recipientId
                                                            ? `${item.recipientId.name} (${item.recipientId.email})`
                                                            : "All Users";

                                                        const projectLabel = item.projectId
                                                            ? item.projectName || "Unnamed Project"
                                                            : "General";

                                                        return (
                                                            <tr key={item._id}>
                                                                <td>{i + serialNo - 10 + 1}</td>

                                                                <td>{item.title}</td>

                                                                <td>
                                                                    <div
                                                                        style={{ maxWidth: "250px", whiteSpace: "normal" }}
                                                                        dangerouslySetInnerHTML={{ __html: item.message }}
                                                                    />
                                                                </td>

                                                                <td>{handledate(item.createdAt)}</td>

                                                                <td>{projectLabel}</td>

                                                                <td>
                                                                    {item.isRead ? (
                                                                        <span className="badge badge-success">Read</span>
                                                                    ) : (
                                                                        <span className="badge badge-warning">Unread</span>
                                                                    )}
                                                                </td>

                                                                <td>
                                                                    <small>{userLabel}</small>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7">
                                                            <p>No Data found.</p>
                                                        </td>
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
                                        {notificationData?.pagination?.total > 0 && (
                                            <Commonpagination
                                                ActivePage={currentpage}
                                                ItemsCountPerPage={10}
                                                TotalItemsCount={notificationData.pagination.total}
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
