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
    modal: false,  //delete
    _id: '',
    isloading: false,
    Status: false,  //status
    statusid: '',
    isAct: '',
    isloader: false,
}

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false)
    const { userData, loader } = useSelector((state) => state.user)
    console.log(userData, "userDataa")
    const [currentpage, setCurrentpage] = useState(1);   // for pagination
    const [serialNo, setSerialNo] = useState(10);
    const [istate, setIstate] = useState(initialState);
    const { show, startdate, enddate, search, timeFrame, modal, _id, isloading, Status, statusid, isAct, isloader } = istate

    //===================================useeffect==========================================================
    useEffect(() => {
        dispatch(userList({
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",
        }))
    }, [])
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
        }
        dispatch(userList(data));

    };
    //====================================================open modal===================================
    const showHandler = () => {
        setIstate({ ...istate, show: true })
    }
    const handlclose = () => {
        setIstate({ ...istate, show: false })
    }
    //=============================search handler=========================================================
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
                const res = await dispatch(userList(data))
                if (res?.payload?.code == 200) {
                    setDisable(false)
                }
                else {
                    setDisable(false)

                }
            }

        }
    }
    //==========================================refreshHandler===============================================
    const refreshandler = () => {
        setIstate({ ...istate, startdate: "", enddate: "", search: "", timeFrame: "", })
        dispatch(userList({
            page: currentpage,
            startdate: "",
            enddate: "",
            search: "",
            timeFrame: "",

        }))
    }
    //=====================================delete handler==================================================
    const handleClose = () => {
        setIstate({ ...istate, modal: false, _id: '' })
    }

    const DeleteShowhandler = (id) => {
        setIstate({ ...istate, modal: true, _id: id })
    }

    const handleDelete = async () => {
        setIstate({ ...istate, isloading: true })
        try {
            const data = { id: _id, status: 'DELETED' }
            const res = await dispatch(StatusUser(data))
            console.log('DELETE---', res)
            if (res?.payload?.code === 200) {
                setIstate({ ...istate, modal: false, _id: '' })
                toast.success(" Deleted Successfully", commomObj);
                let res = await dispatch(userList({
                    page: currentpage,
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }))
                if (res?.data?.result?.[0]?.paginationData?.length === 0 && currentpage > 1) {
                    const lastPage = currentpage - 1;
                    setCurrentpage(lastPage);
                    setSerialNo((lastPage) * 10);
                    dispatch(userList({
                        page: lastPage,
                        startdate: "",   //searchbox
                        enddate: "",
                        search: "",
                        timeFrame: "",
                    }))
                }

            } else {
                toast.error(res?.payload?.message, commomObj);
            }
        } catch (err) {
            console.log('handledelete error---', err)
        }
    }
    //................................................status handler......................................
    const statushowhandler = (id, statuss) => {
        console.log('id=', id, 'sta=', statuss)
        setIstate({ ...istate, Status: true, statusid: id, isAct: statuss })
    }
    const statusclose = () => {
        setIstate({ ...istate, Status: false, statusid: '', isAct: '' })
    }
    const statushandler = async () => {
        setIstate({ ...istate, isloader: true })
        try {
            const data = { id: statusid, status: isAct == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
            console.log('DATAAAAA===', data)
            const res = await dispatch(StatusUser(data))
            console.log('ACTIVVVV===', res)
            if (res?.payload?.code === 200) {
                setIstate({ ...istate, Status: false, statusid: '', isAct: '' })
                toast.success("Status Updated Successfully", commomObj);
                dispatch(userList({
                    page: currentpage,
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }))

            }
        } catch (err) {
            console.log(err, '=======error')
        }
    }
    const navigateHandler = (id, item) => {
        window.localStorage.setItem('userId', id)
        navigate('/user-management-details/personal', { state: item })
    }

    return (
        <div>
            <Layout>
                <div className="">
                    <div className="WrapperBox">
                        <div className="Small-Wrapper">
                            <div className="TitleBox">
                                <h4 className="Title">
                                    User Management
                                </h4>
                                <div>
                                    <a
                                        className="Button mr-2"
                                        title="Add new user"
                                        onClick={showHandler}
                                    >
                                        Add New User
                                    </a>
                                    <a
                                        className="Button"
                                        title="export "
                                    >
                                        Export
                                    </a>
                                </div>
                            </div>
                            <div className="Filter">
                                <div className="form-group">
                                    <label>Search</label>
                                    <input type="search"
                                        className="form-control"
                                        placeholder="Enter user no.,email or name"
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
                                <table style={{ width: '120%' }}>
                                    <thead>
                                        <tr>
                                            <th>
                                                Sr.No.
                                            </th>
                                            <th>
                                                User Id
                                            </th>
                                            <th>
                                                User Name
                                            </th>
                                            <th>
                                                Mobile No.
                                            </th>
                                            <th>
                                                Email Id
                                            </th>
                                            <th>
                                                Date of Registration
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                            <th>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loader ?
                                            userData?.result?.[0]?.paginationData?.length > 0 ? (
                                                userData?.result?.[0]?.paginationData?.map((item, i) => {
                                                    return (
                                                        <tr>
                                                            <td>{i + 1 + serialNo - 10}</td>
                                                            <td>
                                                                <Link to="/user-management-details/personal" state={item}>
                                                                    {item?.user_number}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                {item?.userName}
                                                            </td>
                                                            <td>
                                                                {item?.phoneNumber}
                                                            </td>
                                                            <td>
                                                                {item?.email}
                                                            </td>
                                                            <td>
                                                                {handledate(item?.createdAt)}
                                                            </td>
                                                            <td>
                                                                <span className={item?.userStatus == "ACTIVE" ? "Green" : "Red"}>
                                                                    {item?.userStatus}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="Actions">
                                                                    <label className="Switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item?.userStatus == 'ACTIVE' ? true : false}
                                                                            onClick={() => statushowhandler(item?._id, item?.userStatus)}
                                                                        />
                                                                        <span className="slider" />
                                                                    </label>
                                                                    <a
                                                                        className="Blue"
                                                                        title="User details"
                                                                        onClick={() => navigateHandler(item?._id, item)}
                                                                    >
                                                                        <i className="fa fa-eye" />
                                                                    </a>
                                                                    <a
                                                                        className="Red"
                                                                        data-target="#DeleteModal"
                                                                        data-toggle="modal"
                                                                        title="User Delete"
                                                                        onClick={() => DeleteShowhandler(item?._id)}
                                                                    >
                                                                        <i className="fa fa-trash" />
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
                                    {userData?.result?.[0]?.totalCount?.[0]?.count > 0 && (
                                        <Commonpagination
                                            ActivePage={currentpage}
                                            ItemsCountPerPage={10}
                                            TotalItemsCount={userData?.result?.[0]?.totalCount?.[0]?.count}
                                            PageRangeDisplayed={5}
                                            Onchange={Pagehandler}
                                        />
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <UserModal
                    onShow={show}
                    onClose={handlclose}
                />
                <Statusmodal
                    onOpen={Status}
                    onClose={statusclose}
                    loading={isloader}
                    type={isAct}
                    message='User'
                    onDelete={statushandler}
                />
                <Deletemodal
                    onOpen={modal}
                    onClose={handleClose}
                    loading={isloading}
                    message='User'
                    onDelete={handleDelete}
                />

            </Layout>
        </div >
    )
}

export default UserManagement
