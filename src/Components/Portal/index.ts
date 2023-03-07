import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const Portal = ({ children, element }: {
    children: JSX.Element | React.ReactNode;
    element: string
}) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    return mounted
        ? createPortal(children,
            document.getElementById(element) as Element)
        : null
}

export default Portal