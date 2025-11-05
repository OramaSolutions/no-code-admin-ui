import Modal from 'react-bootstrap/Modal';

export const Deletemodal = ({onOpen, onClose, loading, message, onDelete }) => {
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
                        <h3>Delete</h3>
                        <p>Are you sure you want to delete this {message} ?</p>
                        <h4>
                            <a role='button'  data-dismiss="modal" onClick={onClose}>
                                no
                            </a>
                            <a role='button'  data-dismiss="modal"
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