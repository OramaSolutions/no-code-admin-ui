import { Modal } from "react-bootstrap";

export const Statusmodal = ({ onOpen, onClose, type, loading, message, onDelete }) => {
    return (
        <div>
            <Modal
                show={onOpen}
                onHide={onClose}
                className="ModalBox"
            >
                <Modal.Body>
                    <div className="Decline">
                        <a
                            className="CloseModal"
                            onClick={onClose}
                        >
                            ×
                        </a>
                        <h3><b>Status</b></h3>
                        <p>Are you sure you want to {type == 'ACTIVE' ? 'InActive' : 'Active'} this {message} ?</p>
                        <h4 style={{display:"flex",justifyContent:"space-between",color:"blue"}}>
                            <a role='button'  data-dismiss="modal" onClick={onClose}>
                                    No
                            </a>
                            <a role='button' 
                                data-dismiss="modal"
                                disabled={loading}
                                onClick={() => {
                                    if (!loading) {
                                        onDelete()
                                    }
                                }}
                            >


                                Yes
                            </a>
                        </h4>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}