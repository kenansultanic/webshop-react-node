import {Outlet} from 'react-router-dom'
import {useState, useEffect} from "react"
import useAuth from '../hooks/useAuth'
import useToken from "../hooks/useToken"

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const {auth} = useAuth()
    const getToken = useToken()

    useEffect(() => {
        const verify = async () => {
            try {
                await getToken()
            }
            catch (error) {
                console.error(error)
            }
            finally {
                setIsLoading(false)
            }
        }
        !auth?.accessToken ? verify() : setIsLoading(false)
    }, [])

    return (
        <>
            {
                !isLoading
                    ? <Outlet/>
                    : <></>
            }
        </>
    )
}

export default PersistLogin