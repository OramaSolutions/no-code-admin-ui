import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginVerification = () => {
    const navigate=useNavigate();
    const navigateHandler=()=>{
        navigate("/login-forgot")
    }
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
                        <form>
                            <aside>
                                <figure>
                                    <img src={require("../../assets/images/Logo.png")} />
                                </figure>
                                <h4>
                                    Email send Successfully
                                </h4>
                                <p>
                                    Please Check your email to create a new password
                                </p>
                                <h3>
                                    Can't get email ?{' '}
                                    <a href="#">
                                        Resubmit
                                    </a>
                                </h3>
                            </aside>
                            <button
                                className="Button"
                                onClick={navigateHandler}
                            >
                                Back Email
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginVerification
