import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { commomObj } from '../../utils';
import { toast } from 'react-toastify';
import { SetPassword } from '../../reduxToolkit/Slices/authSlices';

const initialState = {
    password: "",
    confirmPassword: "",
    loading: false,
    eye1:false,
    eye2:false,
}

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [show, setShow] = useState(initialState)
    const { password, confirmPassword, loading,eye1,eye2 } = show;
    const [error, setError] = useState(false);

    const token = location?.search?.split("?")[1]

    //=========================================input handler=====================================================
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setShow({ ...show, [name]: value })
    }
    //===================================handle submit=================================================================
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password.trim() == "" || confirmPassword?.trim() == "" || password !== confirmPassword || (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password.trim()))) {
            setError(true)
        }
        else {
            try {
                const data = { token: token, password: password.trim() };
                const res = await dispatch(SetPassword(data))
                console.log(res, "ressssssss")
                if (res?.payload?.code === 200) {
                    toast.success(res.payload.message, commomObj)
                    navigate("/loginSuccess")
                    setShow({ ...show, password: "", loading: false, confirmPassword: "" })
                }
                else {
                    toast.error(res?.payload?.message, commomObj)
                    setShow({ ...show, loading: false })
                }
            }
            catch (err) {
                toast.error(err?.payload?.message, commomObj)
                console.log("erttttrdesfg", err)
            }
        }

    };



    return (
        <div>
            <div className="LoginArea">
                <div className="LoginBox">
                    <div className="LoginLeft">
                        {/* <img
                            alt=""
                            src="images/login-bg.png"
                        /> */}
                    </div>
                    <div className="LoginRight">
                        <form onSubmit={handleSubmit}>
                            <aside>
                                <figure>
                                    <img src={require("../../assets/images/Logo.png")} />
                                </figure>
                                <h4>
                                    ADMIN PANEL
                                </h4>
                                <div className="form-group">
                                    <label>
                                        Create New Password
                                    </label>
                                    <input
                                        className="form-control"
                                        type={eye1?"text":"password"}
                                        name='password'
                                        value={password}
                                        onChange={inputHandler}
                                    />
                                    <span className="Icon">
                                        <i className={eye1?"fa fa-eye":'fa fa-eye-slash'} onClick={()=>setShow({...show,eye1:!eye1})} />
                                    </span>
                                    {error && confirmPassword.trim() == "" ? <span style={{ color: "red" }}>*Password is required</span>:error&&(!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(confirmPassword))? <span style={{ color: "red" }}>*Combine uppercase and lowercase letters, and symbols</span>: ''}
                                </div>
                                <div className="form-group">
                                    <label>
                                        Confirm Password
                                    </label>
                                    <input
                                        className="form-control"
                                        placeholder=""
                                        type={eye2?"text":"password"}
                                        name='confirmPassword'
                                        value={confirmPassword}
                                        onChange={inputHandler}
                                    />
                                    <span className="Icon">
                                        <i className={eye2?"fa fa-eye":'fa fa-eye-slash'} onClick={()=>setShow({...show,eye2:!eye2})}/>
                                    </span>
                                    {error && password.trim() == "" ? <span style={{ color: "red" }}>*Password is required</span> :error && password !== confirmPassword ? <span style={{ color: "red" }}>*New password and confirm password must be same </span> : ''}
                                </div>
                            </aside>
                            <button
                                className="Button"
                                id="myButton"
                                disabled={loading}
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
