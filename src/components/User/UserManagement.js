import React, { useEffect, useState } from 'react'
import UserModal from './UserModal'
import { useSelector, useDispatch } from 'react-redux'
import { DeleteUser, StatusUser, userList } from '../../reduxToolkit/Slices/userSlices'
import Loader from '../../commonfiles/Loader'
import { Commonpagination } from '../../commonfiles/Pagination'
import { handledate, commomObj } from '../../utils'
import { toast } from 'react-toastify';
import { Statusmodal } from '../../commonfiles/StatusModal'
import { Deletemodal } from '../../commonfiles/DeleteModal'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../NavSideWrapper'

const initialState = {
    show: false,
    startdate: "",
    enddate: "",
    search: "",
    timeFrame: "",
    modal: false,  // delete modal open
    _id: '',
    isloading: false,
    Status: false,  // status modal
    statusid: '',
    isAct: '',
    isloader: false,
    permanent: false, // new flag for permanent delete
}

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);
    const { userData, loader } = useSelector((state) => state.user);
    const [currentpage, setCurrentpage] = useState(1);
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { show, startdate, enddate, search, timeFrame, modal, _id, isloading, Status, statusid, isAct, isloader, permanent } = istate;


    console.log(userData?.result?.[0], "userDatauserData");

    //===================================useeffect==========================================================
    useEffect(() => {
        dispatch(userList({
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",
        }));
    }, []);

    //..............................pagination......................................................
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
        };
        dispatch(userList(data));
    };

    //====================================================open modal===================================
    const showHandler = () => {
        setIstate({ ...istate, show: true });
    };
    const handlclose = () => {
        setIstate({ ...istate, show: false });
    };

    //=============================search handler=========================================================
    const addinputhandler = (e) => {
        const { name, value } = e.target;
        setIstate({ ...istate, [name]: value });
    };

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
            const newstartdate = new Date(startdate);
            const newenddate = new Date(enddate);
            if (newstartdate.getTime() >= newenddate.getTime()) {
                toast.error("End date must be greater than start date", commomObj);
            } else {
                setDisable(true);
                const data = {
                    page: "",
                    startdate: startdate,
                    enddate: enddate,
                    search: search.trim(),
                    timeFrame,
                };
                const res = await dispatch(userList(data));
                setDisable(false);
            }
        }
    };

    //==========================================refreshHandler===============================================
    const refreshandler = () => {
        setIstate({ ...istate, startdate: "", enddate: "", search: "", timeFrame: "", });
        dispatch(userList({
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",
        }));
    };

    //=====================================delete handler==================================================
    const handleClose = () => {
        setIstate({ ...istate, modal: false, _id: '', permanent: false });
    };

    // Open modal for deactivate or permanent delete
    const DeleteShowhandler = (id, permanent = false) => {
        setIstate({ ...istate, modal: true, _id: id, permanent });
    };

    // Soft delete (deactivate)
    const handleDelete = async () => {
        setIstate({ ...istate, isloading: true });
        try {
            const data = { id: _id, status: 'DELETED' };
            const res = await dispatch(StatusUser(data));
            if (res?.payload?.code === 200) {
                setIstate({ ...istate, modal: false, _id: '' });
                toast.success("User deleted successfully", commomObj);
                await dispatch(userList({
                    page: currentpage,
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }));
            } else {
                toast.error(res?.payload?.message, commomObj);
            }
        } catch (err) {
            console.log('handleDelete error:', err);
        } finally {
            setIstate({ ...istate, isloading: false });
        }
    };

    // Permanent delete
    const handlePermanentDelete = async () => {
        setIstate({ ...istate, isloading: true });
        try {
            const res = await dispatch(DeleteUser({ id: _id }));
            if (res?.payload?.code === 200) {
                toast.success("User permanently deleted successfully", commomObj);
                setIstate({ ...istate, modal: false, _id: '', permanent: false });
                await dispatch(userList({
                    page: currentpage,
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }));
            } else {
                toast.error(res?.payload?.message || "Error deleting user", commomObj);
            }
        } catch (err) {
            console.log("handlePermanentDelete error:", err);
        } finally {
            setIstate({ ...istate, isloading: false });
        }
    };

    //................................................status handler......................................
    const statushowhandler = (id, statuss) => {
        setIstate({ ...istate, Status: true, statusid: id, isAct: statuss });
    };
    const statusclose = () => {
        setIstate({ ...istate, Status: false, statusid: '', isAct: '' });
    };
    const statushandler = async () => {
        setIstate({ ...istate, isloader: true });
        try {
            const data = { id: statusid, status: isAct == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
            const res = await dispatch(StatusUser(data));
            if (res?.payload?.code === 200) {
                setIstate({ ...istate, Status: false, statusid: '', isAct: '' });
                toast.success("Status updated successfully", commomObj);
                dispatch(userList({
                    page: currentpage,
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }));
            }
        } catch (err) {
            console.log(err, 'status error');
        } finally {
            setIstate({ ...istate, isloader: false });
        }
    };

    const navigateHandler = (id, item) => {
        window.localStorage.setItem('userId', id);
        navigate('/user-management-details/personal', { state: item });
    };

    return (
        <Layout>
            <div className="WrapperBox">
                <div className="Small-Wrapper">
                    <div className="TitleBox">
                        <h4 className="Title">User Management</h4>
                        <div>
                            <button className="Button mr-2" onClick={showHandler}>Add New User</button>
                            <button className="Button">Export</button>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="Filter">{/* filter inputs here as before */}</div>

                    {/* Table */}
                    <div className="TableList overflow-x-auto">
                        <table className="min-w-[120%]">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>User Id</th>
                                    <th>User Name</th>
                                    <th>Mobile No.</th>
                                    <th>Email Id</th>
                                    <th>Date of Registration</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loader ? (
                                    userData?.result?.[0]?.paginationData?.length > 0 ? (
                                        userData.result[0].paginationData.map((item, i) => (
                                            <tr key={item._id}>
                                                <td>{i + 1 + serialNo - 10}</td>
                                                <td>
                                                    <Link to="/user-management-details/personal" state={item}>
                                                        {item.user_number}
                                                    </Link>
                                                </td>
                                                <td>{item.userName}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>{item.email}</td>
                                                <td>{handledate(item.createdAt)}</td>
                                                <td>
                                                    <span className={item.userStatus === "ACTIVE" ? "Green" : "Red"}>
                                                        {item.userStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <label className="Switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.userStatus === 'ACTIVE'}
                                                                onClick={() => statushowhandler(item._id, item.userStatus)}
                                                            />
                                                            <span className="slider" />
                                                        </label>
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="User details"
                                                            onClick={() => navigateHandler(item._id, item)}
                                                        >
                                                            <i className="fa fa-eye" />
                                                        </button>
                                                        <button
                                                            className="text-red-300 hover:text-red-400"
                                                            title="Deactivate"
                                                            onClick={() => DeleteShowhandler(item._id, false)}
                                                        >
                                                            <i className="fa fa-ban" />
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Delete Permanently"
                                                            onClick={() => DeleteShowhandler(item._id, true)}
                                                        >

                                                            <i className="fa fa-trash" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8"><p>No Data found.</p></td>
                                        </tr>
                                    )
                                ) : <Loader />}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <ul>
                            {userData?.result?.[0]?.totalCount?.[0]?.count > 0 && (
                                <Commonpagination
                                    ActivePage={currentpage}
                                    ItemsCountPerPage={10}
                                    TotalItemsCount={userData.result[0].totalCount[0].count}
                                    PageRangeDisplayed={5}
                                    Onchange={Pagehandler}
                                />
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <UserModal onShow={show} onClose={handlclose} />

            <Statusmodal
                onOpen={Status}
                onClose={statusclose}
                loading={isloader}
                type={isAct}
                message="User"
                onDelete={statushandler}
            />

            <Deletemodal
                onOpen={modal}
                onClose={handleClose}
                loading={isloading}
                message="User"
                onDelete={handleDelete}
                onDeletePermanent={handlePermanentDelete}
                type={permanent ? "permanent" : "soft"}
            />
        </Layout>
    );
};

export default UserManagement;
