import useAuth from "./useAuth"
import {axiosRequest} from "../APIs/AxiosClient";

const useLogout = () => {

    const {setAuth} = useAuth()

    const logout = async () => {

        setAuth({})
        try {
            const response = await axiosRequest.get('/logout', {
                withCredentials: true
            })
        }
        catch(error) {
            console.error(error)
        }
    }
    return logout
}

export default useLogout