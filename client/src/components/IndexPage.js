import '../styles/IndexPage.css'
import {useState} from "react"
import useAuth from "../hooks/useAuth"
import {Alert, Checkbox} from "@mui/material"
import {axiosRequest} from "../APIs/AxiosClient"
import util from "../utils/util-functions"
import {Link, useLocation} from 'react-router-dom'
import {useNavigate} from "react-router";

const IndexPage = () => {

    const {setAuth} = useAuth()

    const navigate = useNavigate()
    const location = useLocation()

    const [login, setLogin] = useState(true)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')
    const [newsletter, setNewsletter] = useState(true)
    const [alertMessage, setAlertMessage] = useState('')
    const [displayAlert, setDisplayAlert] = useState(false)
    const [alertSeverity, setAlertSeverity] = useState(false)

    const toggleLogin = () => {
        setLogin(!login)
        setName('')
        setSurname('')
        setEmail('')
        setPassword('')
        setRepeatedPassword('')
        setDisplayAlert(false)
    }

    const registerUser = () => {
        if (!checkPasswords()) {
            setDisplayAlert(true)
            setAlertSeverity(true)
            return
        }
        if (!util.validateEmail(email)) {
            setAlertMessage('Wrong e-mail format')
            setDisplayAlert(true)
            setAlertSeverity(true)
            return
        }

        axiosRequest.post('/register', {
            name: name,
            surname: surname,
            email: email,
            password: password,
            newsletter: newsletter
        })
            .then(response => {
                if (response.data.isSaved === 1) {
                    toggleLogin()
                    setAlertMessage('Account successfully created')
                    setAlertSeverity(false)
                } else {
                    setAlertMessage('Email already in use')
                    setAlertSeverity(true)
                }
                setDisplayAlert(true)
            })
            .catch(error => {
                console.error(error)
            })

    }

    const loginUser = () => {
        axiosRequest.post('/login', {
            email: email,
            password: password
        }).then(response => {
            console.log(response)
            if (response.data.accessToken) {
                const accessToken = response.data.accessToken
                const user = response.data.user
                setAuth({email, password, user, accessToken})
                if (user.type === 'admin')
                    navigate('/admin')
                else navigate('/home')
                //navigate(from, {replace: true})
            }
        }, error => {
            if (error?.response?.data?.message)
                setAlertMessage(error.response.data.message)
            else setAlertMessage('Server error')
            setAlertSeverity(true)
            setDisplayAlert(true)
            console.error(error)
        })
    }

    const checkPasswords = () => {
        if (password !== repeatedPassword) {
            setAlertMessage('Password mismatch')
            return false
        }
        if (!util.validatePassword(password)) {
            setAlertMessage('A password must contain at least one capital letter and a number and must contain 8-20 characters')
            return false
        }
        return true
    }

    return (
        <div className={'index-main'}>
            <div className={'index-image'}>
                <img src={require('../media/webshop1.jpg')} alt={'image'}/>
            </div>
            <div className={'index-login'}>
                <div>
                    <div className={login ? 'index-login-form login-active' : 'index-login-form'}>
                        <h2>LOG IN</h2>
                        <input type={'email'} placeholder={'Email'} onChange={(e) => setEmail(e.target.value)}
                               value={email} name={'email'}/>
                        <input type={'password'} placeholder={'Password'} value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                        <div className={'login-options'}>
                            <Link to={'/forgot-password'} style={{textDecoration: 'none'}}><p>Forgot password?</p>
                            </Link>
                            <p onClick={toggleLogin}>Don't have an account? Register</p>
                            <p>Continue as guest</p>
                        </div>
                        <button className={'button'} onClick={loginUser}>Log in</button>
                    </div>
                    <div className={!login ? 'index-register-form login-active' : 'index-register-form'}>
                        <h2>SIGN UP</h2>
                        <input type={'text'} placeholder={'Name'} onChange={(e) => setName(e.target.value)}
                               value={name}/>
                        <input type={'text'} placeholder={'Surname'} onChange={(e) => setSurname(e.target.value)}
                               value={surname}/>
                        <input type={'email'} placeholder={'Email'} onChange={(e) => setEmail(e.target.value)}
                               value={email} name={'email'}/>
                        <input type={'password'} placeholder={'Password'} value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                        <input type={'password'} placeholder={'Repeated Password'} value={repeatedPassword}
                               onChange={(e) => setRepeatedPassword(e.target.value)}/>
                        <div className={'newsletter-signup'}>
                            <span>Sign up to newsletter</span>
                            <Checkbox defaultChecked={true}
                                      onClick={() => setNewsletter(!newsletter)}/>
                        </div>
                        <div className={'login-options'}>
                            <p onClick={toggleLogin}>Login instead</p>
                            <p>Continue as guest</p>
                        </div>
                        <button className={'button'} onClick={registerUser}>Sign up</button>
                    </div>
                    <div className={displayAlert ? 'alert-container display-alert' : 'alert-container'}>
                        <Alert severity={alertSeverity ? 'warning' : 'success'}
                               onClose={() => setDisplayAlert(false)}>{alertMessage}</Alert>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default IndexPage