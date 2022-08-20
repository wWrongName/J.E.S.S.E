let Controller = function () {
    let rollUpButton, minMaxButton, closeButton

    let _mixMaxListener = () => window.ipc.send("maximize")
    let _closeListener = () => window.ipc.send("close")
    let _rollUpListener = () => window.ipc.send("minimize")

    this.init = () => {
        rollUpButton = document.querySelector(".win-button.roll-up")
        minMaxButton = document.querySelector(".win-button.minimize-maximize")
        closeButton = document.querySelector(".win-button.close")

        rollUpButton.removeEventListener("click", _rollUpListener)
        minMaxButton.removeEventListener("click", _mixMaxListener)
        closeButton.removeEventListener("click", _closeListener)

        rollUpButton.addEventListener("click", _rollUpListener)
        minMaxButton.addEventListener("click", _mixMaxListener)
        closeButton.addEventListener("click", _closeListener)
    }
}

export default Controller
