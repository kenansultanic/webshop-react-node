import {useNavigate, Outlet} from 'react-router'
import useAuth from '../hooks/useAuth'

const RequireAuth = ({type}) => {
    const {auth} = useAuth()
    const navigate = useNavigate()

    return (
        auth?.user.type === type
            ? <Outlet/>
            : auth?.accessToken
                ? navigate(-1)
                : navigate('/')
    )
}

export default RequireAuth