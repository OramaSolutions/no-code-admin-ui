import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmail } from '../../reduxToolkit/Slices/authSlices';
import { commomObj } from '../../utils';

let initialstate = {
    email: '',
    loading: false,
};

const Forgot = () => {
    console.log("dfgm,.")
    const [show, setShow] = useState(initialstate)
    const { email, loading } = show;
    const [error, setError] = useState(false)
    console.log(show, 'showwwww')
    const dispatch = useDispatch()
    const navigate = useNavigate();

    //=========================================input handler=====================================================
    const inputHandler = (e) => {
        const { name, value } = e.target;
        setShow({ ...show, [name]: value })
    }
    //===================================handle submit=================================================================
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (email?.trim() == "" || !/^.+?@.+?\..+$/.test(email)) {
            setError(true)
        }
        else {
            try {
                const data = { email: email.trim() };
                const res = await dispatch(sendEmail(data))
                console.log(res, "ressssssss")
                if (res?.payload?.code === 200) {
                    navigate('/loginVerification');
                    toast.success(res.payload.message, commomObj)

                    setShow({ ...show, email: "", loading: false })
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
                            src={require("../../assets/images/bg.png")}
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
                                <p>
                                    Please enter your Email to Reset your Password
                                </p>
                                <br />
                                <div className="form-group">
                                    <label>
                                        Enter Email Address
                                    </label>
                                    <input
                                        className="form-control"
                                        placeholder="Enter Email Address"
                                        type="text"
                                        name='email'
                                        value={email}
                                        onChange={inputHandler}
                                    />
                                 {error && email.trim() == "" ? <span style={{ color: "red" }}>*Email is required</span> : error && (!/^.+?@.+?\..+$/.test(email)) ? <span style={{ color: "red" }}>*Email format is not valid</span> : ''}
                                </div>
                                <p>
                                    Remember the password ?{' '}
                                    <Link to="/">
                                        Log in
                                    </Link>
                                </p>
                            </aside>
                            <button
                                className="Button"
                                id="myButton"
                                disabled={loading}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forgot
