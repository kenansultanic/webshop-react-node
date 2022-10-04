import '../styles/ProfilePage.css'
import {IoIosArrowForward} from 'react-icons/io'
import React, {useEffect, useState, useCallback} from "react";
import AccountDetails from "./profile_page_components/AccountDetails";
import AddressDetails from "./profile_page_components/AddressDetails";
import {axiosRequest} from "../APIs/AxiosClient";
import useLogout from "../hooks/useLogout";
import {useNavigate} from "react-router";
import BasicSnackbar from "./BasicSnackbar";

const ProfilePage = () => {

    const logout = useLogout()
    const navigate = useNavigate()

    const [purchases, setPurchases] = useState(true)
    const [profile, setProfile] = useState(false)
    const [settings, setSettings] = useState(false)
    const [open, setOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('')

    const [account, setAccount] = useState(false)
    const [address, setAddress] = useState(false)
    const [user, setUser] = useState({})
    const [orders, setOrders] = useState([])
    const [newsletter, setNewsletter] = useState(null)

    const toggle = (first, second, third = null) => {
        first(true)
        second(false)
        if (third)
            third(false)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return
        setOpen(false)
    }

    const displaySnackbar = (severity, message) => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpen(true)
    }

    const togglePurchases = () => toggle(setPurchases, setProfile, setSettings,)
    const toggleProfile = () => toggle(setProfile, setPurchases, setSettings)
    const toggleSettings = () => toggle(setSettings, setProfile, setPurchases)
    const toggleAccount = () => toggle(setAccount, setAddress)
    const toggleAddress = () => toggle(setAddress, setAccount)

    useEffect(() => {
        getUserInfo()
        getUserOrders()
    }, [])

    const wrapperSetUserState = useCallback(val => {
        setUser(val)
    }, [setUser])

    const getUserInfo = () => {
        axiosRequest.get('/get-user-info')
            .then(response => {
                setUser(response.data)
                setNewsletter(response.data.newsletter)
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Server error')
            })
    }
    const getUserOrders = () => {
        axiosRequest.get('/user-order-history')
            .then(response => {
                setOrders(response.data)
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Server error')
            })
    }

    const cancelNewsletter = () => {
        axiosRequest.post('/cancel-newsletter')
            .then(response => {
                setNewsletter(false)
                displaySnackbar('success', 'Subscription canceled')
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Could not cancel subscription')
            })
    }

    const subscribeToNewsletter = () => {
        axiosRequest.post('/join-newsletter')
            .then(response => {
                setNewsletter(true)
                displaySnackbar('success', 'Joined newsletter')
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Could not join newsletter')
            })
    }

    const signOut = async () => {
        navigate('/')
        await logout()
    }

    return (
        <div className={'profile-page-container'}>
            <div className={'page-menu'}>
                <ul>
                    <li onClick={togglePurchases} className={purchases ? 'active-menu-item' : ''}>PURCHASES</li>
                    <li onClick={toggleProfile} className={profile ? 'active-menu-item' : ''}>PROFILE</li>
                    <li onClick={toggleSettings} className={settings ? 'active-menu-item' : ''}>SETTINGS</li>
                </ul>
                <div className={purchases ? 'purchases active' : 'purchases'}>
                    {
                        orders.length === 0
                            ? <p>No orders have been found</p>
                            :
                            <table className={'table-responsive'}>
                                <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    orders.map(order => {
                                        return <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{new Date(order.order_date).toLocaleDateString('en-GB')}</td>
                                            <td>{order.order_status}</td>
                                            <td>{order.items}</td>
                                            <td>{order.total}</td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                    }

                </div>
                <div className={profile ? 'profile active' : 'profile'}>
                    <div>
                        <h2 className={'uppercase'}>{user.name} {user.surname}</h2>
                        <h3>{user.email}</h3>
                    </div>
                    <div onClick={toggleAccount}>
                        <h2>ACCOUNT</h2>
                        <h3>EMAIL, PASSWORD, SIGN OUT...</h3>
                        <div><IoIosArrowForward/></div>
                    </div>
                    <div onClick={toggleAddress}>
                        <h2>ADDRESS</h2>
                        <h3>SHIPPING AND BILLING ADDRESS</h3>
                        <div><IoIosArrowForward/></div>
                    </div>
                </div>
                <div className={settings ? 'settings active' : 'settings'}>
                    <h3>Newsletter</h3>
                    {
                        newsletter
                            ? <button className={'button'} onClick={cancelNewsletter}>Cancel subscription</button>
                            : <button className={'button'} onClick={subscribeToNewsletter}>Subscribe</button>
                    }
                </div>
            </div>
            <div className={'page-menu-details'}>
                <div className={purchases ? 'purchases-menu' : 'purchases-menu active-menu'}>

                </div>
                <div className={account && profile ? 'profile-menu  active-menu' : 'profile-menu'}>
                    <AccountDetails user={user} setUser={wrapperSetUserState} signOut={signOut} displaySnackbar={displaySnackbar}/>
                </div>
                <div className={address && profile ? 'address-menu active-menu' : 'address-menu'}>
                    <AddressDetails user={user} displaySnackbar={displaySnackbar}/>
                </div>
            </div>
            <div className={'snackbar'}>
                <BasicSnackbar open={open} onClose={handleClose} severity={snackbarSeverity} message={snackbarMessage}/>
            </div>
        </div>
    )
}

export default ProfilePage