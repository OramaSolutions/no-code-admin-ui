import React from 'react'
import Header from '../Header'
import Sidenav from '../Sidenav'
import { useLocation } from 'react-router-dom'

function ReportDetails() {
    const { state } = useLocation();
    return (
        <div>
            <Header />
            <Sidenav />
            <div className="WrapperArea">
                <div className="WrapperBox">
                    <div className="">
                        <div className="InformationBox">
                            <h4>View Details</h4>
                            <br />
                            <div className="Information">
                                <article>
                                    <aside>
                                        <p>
                                            <strong>Address To</strong> <span>{state?.addressTo}</span>
                                        </p>
                                        <p>
                                            <strong>Subject</strong> <span>{state?.subject}</span>
                                        </p>
                                    </aside>
                                </article>
                            </div>
                            <div className="Information">
                                <article>
                                    <aside>
                                        <p>
                                            <strong>Description</strong> <span>{state?.description}</span>
                                        </p>
                                        <p>
                                            <strong>Image</strong><span>
                                            <figure>
                                                {state?.uploadFile && <img src={state?.uploadFile}
                                                    alt="" />}
                                            </figure>
                                            </span>
                                        </p>
                                    </aside>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ReportDetails
