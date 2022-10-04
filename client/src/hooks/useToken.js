import useAuth from "./useAuth"
import {axiosRequest} from "../APIs/AxiosClient"

const useToken = () => {

    const {setAuth} = useAuth()

    const getToken = async () => {

        const response = await axiosRequest.get('/token', {
            withCredentials: true
        })
        setAuth(response.data)

        return response.data
    }
    return getToken
}

export default useToken