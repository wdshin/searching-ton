import { ReactNode } from "react"
import * as ReactDOM from "react-dom"

interface Props {
  children: ReactNode
}

const Modal = ({ children }: Props) => {
  return ReactDOM.createPortal(children, document.querySelector("#modal-root"))
}

export default Modal
