import React, { useState } from 'react'
import { commomObj } from '../../utils';
import { adminLogin } from '../../reduxToolkit/Slices/authSlices';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


const initialState = {
    email: "",
    password: "",
    loading: false,
    errors: {},
}

const Login = () => {
    const [show, setShow] = useState(initialState)
    const { email, password, loading, errors } = show;
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
        let formValid = handleValidation()
        if (formValid) {
            try {
                const data = { email: email.trim(), password: password.trim() };
                const res = await dispatch(adminLogin(data))
                console.log(res, "ressssssss")
                if (res?.payload?.code === 200) {
                    navigate('/dashboard');
                    toast.success(res.payload.message, commomObj)

                    setShow({ ...show, email: "", password: "", loading: false })
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
    //==================================validation========================================================================
    const handleValidation = () => {
        let error = {}
        let formValid = true;
        if (!email.trim()) {
            error.emailIdError = "*Email cannot be empty*"
            formValid = false
        } else {
            if (!/^.+?@.+?\..+$/.test(email)) {
                error.emailIdError = "*Email format is not valid*"
                formValid = false
            }
        }

        if (!password.trim()) {
            error.PasswordError = "*Password cannot be empty*"
            formValid = false
        }

        setShow({
            ...show,
            errors: error,
        });
        return formValid
    }

    return (
        <div>
            <div className="LoginArea">
                <div className="LoginBox">
                    <div className="LoginLeft" />
                    <div className="LoginRight">
                        <form onSubmit={handleSubmit}>
                            <aside>
                                <figure>
                                    <img src={require("../../assets/images/Logo.png")} />
                                </figure>
                                <h4>ADMIN PANEL</h4>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Username"
                                        className="form-control"
                                        name='email'
                                        value={email}
                                        onChange={inputHandler}
                                    />
                                     <span style={{color:'red'}} >{errors.emailIdError}</span>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        className="form-control"
                                        name='password'
                                        value={password}
                                        onChange={inputHandler}
                                    />
                                 <span style={{color:'red'}} >{errors.PasswordError}</span>
                                </div>
                            </aside>
                            <button id="myButton" className="Button" disabled={loading}>
                                Login
                            </button>
                        </form>
                        <article>
                            <Link to="/login-forgot">Forget Password?</Link>
                        </article>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login
