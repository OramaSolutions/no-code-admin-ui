import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginSuccess = () => {
    const navigate=useNavigate();

    const navigateHandler=()=>{
        navigate("/")
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
                                <div className="Congratulations">
                                    <img src={require("../../assets/images/Success.png")} />
                                    <h3>
                                        Congratulations!
                                    </h3>
                                    <h6>
                                        Your password has been updated successfully !!
                                    </h6>
                                </div>
                            </aside>
                            <button
                                className="Button"
                                id="myButton"
                                onClick={navigateHandler}
                            >
                                Done
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginSuccess
