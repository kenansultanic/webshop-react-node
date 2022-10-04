import '../../styles/AccountDetails.css'
import {IoIosArrowForward} from "react-icons/io";
import {useState, useEffect, useRef} from "react";
import {axiosRequest} from "../../APIs/AxiosClient";
import util from "../../utils/util-functions";

const AccountDetails = ({user, setUser, signOut, displaySnackbar}) => {

    const [email, setEmail] = useState(false)
    const [password, setPassword] = useState(false)

    const [userPassword, setUserPassword] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [repeatedNewPassword, setRepeatedNewPassword] = useState('')

    const userRef = useRef()
    const [childState, setChildState] = useState(user)

    const toggleEmail = () => {
        setEmail(!email)
        setPassword(false)
    }

    const togglePassword = () => {
        setPassword(!password)
        setEmail(false)
    }

    const back = () => {
        setPassword(false)
        setEmail(false)
    }

    const changeEmail = () => {
        axiosRequest.post('/change-email', {
            newEmail: newEmail,
            email: user.email,
            password: userPassword
        })
            .then(response => {
                user.email = newEmail
                setUser(user)
                displaySnackbar('success', 'Email changed')
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Could not change email')
            })
    }

    const changePassword = () => {

        if (newPassword !== repeatedNewPassword) {
            displaySnackbar('error', 'Password mismatch')
            return;
        }
        if (!util.validatePassword(newPassword)) {
            displaySnackbar('error', 'Weak password')
            return
        }

        axiosRequest.post('/change-password', {
            newPassword: newPassword,
            email: user.email,
            password: userPassword
        })
            .then(response => {
                displaySnackbar('success', 'Password successfully changed')
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Could not change password')
            })
    }

    return (
        <div className={!email && !password ? 'details-main' : 'details-main details-new-margin'}>
            <div className={!email && !password ? 'details details-active' : 'details'}>
                <div onClick={toggleEmail}>
                    <h2>CHANGE EMAIL</h2>
                    <div><IoIosArrowForward/></div>
                </div>
                <div onClick={togglePassword}>
                    <h2>CHANGE PASSWORD</h2>
                    <div><IoIosArrowForward/></div>
                </div>
                <div className={'button-container'}>
                    <button className={'button sign-out-button'} onClick={signOut}>SIGN OUT</button>
                </div>
            </div>
            <div className={email ? 'change-email details-active' : 'change-email'}>
                <h2>CHANGE E-MAIL</h2>
                <h4>YOUR CURRENT E-MAIL ADDRESS IS:</h4>
                <h4 className={'email'}>{user.email}</h4>
                <input type={'password'} placeholder={'Password'} onChange={(e) => setUserPassword(e.target.value)}/>
                <input type={'email'} placeholder={'New Email Address'} onChange={(e) => setNewEmail(e.target.value)}/>
                <button className={'button submit-button'} onClick={changeEmail}>Submit</button>
                <button className={'button back-button'} onClick={back}>Back</button>
            </div>
            <div className={password ? 'change-password details-active' : 'change-password'}>
                <h2>CHANGE PASSWORD</h2>
                <input type={'password'} placeholder={'Current Password'}
                       onChange={(e) => setUserPassword(e.target.value)}/>
                <input type={'password'} placeholder={'New Password'} onChange={(e) => setNewPassword(e.target.value)}/>
                <input type={'password'} placeholder={'Repeat New Password'}
                       onChange={(e) => setRepeatedNewPassword(e.target.value)}/>
                <button className={'button submit-button'} onClick={changePassword}>Submit</button>
                <button className={'button back-button'} onClick={back}>Back</button>
            </div>
        </div>
    )
}

export default AccountDetails