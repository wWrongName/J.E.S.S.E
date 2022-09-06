import React from "react"
import CustomModal from "./CustomModal"


function ErrorModal(props) {
    return (
        <CustomModal
            modaltitle="Error!"
            {...props}
        />
    )
}

export default ErrorModal
