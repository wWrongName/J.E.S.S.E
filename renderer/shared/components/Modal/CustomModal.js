import React from "react"
import { Modal, Button } from "react-bootstrap"


function CustomModal(props) {
    return (
        <Modal
            {...props}
            // size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.modaltitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.modalbody}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CustomModal
