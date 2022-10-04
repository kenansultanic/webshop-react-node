import '../styles/IndexPage.css'
import {useState} from "react"
import {Alert, AlertTitle} from "@mui/material"
import {axiosRequest} from "../APIs/AxiosClient"
import util from "../utils/util-functions"
import {Link, useNavigate, useLocation} from 'react-router-dom'

const IndexPage = () => {

    const [showCode, setShowCode] = useState(false)
    const [code, setCode] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [displayAlert, setDisplayAlert] = useState(false)
    const [alertSeverity, setAlertSeverity] = useState(false)

    const displayAlertMessage = (text, severity) => {
        setAlertMessage(text)
        setAlertSeverity(severity)
        setDisplayAlert(true)
    }

    const findEmail = () => {
        axiosRequest.get(`/find-user/${email}`)
            .then(response => {
                if (response.data.user) {
                    setShowCode(true)
                    displayAlertMessage('Enter the code that was sent to your email address', false)
                }
            })
            .catch(error => {
                displayAlertMessage('Email not registered to system', true)
                console.error(error)
            })
    }

    const restartPassword = () => {
        if (!checkPasswords()) {
            setDisplayAlert(true)
            setAlertSeverity(true)
            return
        }

        axiosRequest.post('/restart-password', {
            password: password,
            code: code
        })
            .then(response => {
                if (response.status === 200)
                    displayAlertMessage('Password successfully restarted', false)
                setTimeout(() => window.location.replace('/'), 2000)
            })
            .catch(error => {
                displayAlertMessage('Incorrect code', true)
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
                    <div className={!showCode ? 'index-login-form login-active' : 'index-login-form'}>
                        <input type={'email'} placeholder={'Your email address'}
                               onChange={(e) => setEmail(e.target.value)}
                               value={email} name={'email'}/>
                        <button className={'button'} onClick={findEmail}>Send code to mail</button>
                    </div>
                    <div className={showCode ? 'index-login-form login-active' : 'index-login-form'}>
                        <input type={'text'} placeholder={'Code'} value={code}
                               onChange={(e) => setCode(e.target.value)}/>
                        <input type={'password'} placeholder={'New Password'} value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                        <input type={'password'} placeholder={'Repeat Password'} value={repeatedPassword}
                               onChange={(e) => setRepeatedPassword(e.target.value)}/>
                        <button className={'button'} onClick={restartPassword}>Restart</button>
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