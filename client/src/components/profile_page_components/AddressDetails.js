import '../../styles/AddressDetails.css'
import {useState} from "react";
import {axiosRequest} from "../../APIs/AxiosClient";

const AddressDetails = ({user, displaySnackbar}) => {

    const [address, setAddress] = useState(false)
    const [userAddress, setUserAddress] = useState(user.address)
    const [zip, setZip] = useState(user.zip)
    const [city, setCity] = useState(user.city)
    const [phone, setPhone] = useState(user.phone)
    const [region, setRegion] = useState(user.region)

    const toggleAddress = () => setAddress(!address)
    const back = () => setAddress(false)

    const updateAddress = () => {

        if (userAddress === '' || city === '' || zip === '') {
            displaySnackbar('error', 'Address, City and ZIP fields cannot be empty')
            return
        }

        axiosRequest.post('/update-address', {
            id: user.id,
            address: userAddress,
            zip: zip,
            city: city,
            phone: phone || '',
            region: region || ''
        })
            .then(response => {
                displaySnackbar('success', 'Address successfully updated')
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Could not save changes')
            })
    }

    return (
        <div className={address ? 'address-details-main address-margin' : 'address-details-main'}>
            <div className={!address ? 'address-details active-address' : 'address-details'}>
                <div>
                    <h2>{user.address || 'No address provided'}</h2>
                    <h3>{user.city} {user.zip}</h3>
                    <h3>{user.province || ''}</h3>
                    <h3>Bosnia & Herzegovina</h3>
                </div>
                <div className={'button-container'}>
                    <button className={'button email-button'} onClick={toggleAddress}>Edit address</button>
                </div>
            </div>
            <div className={address ? 'edit-address active-address' : 'edit-address'}>
                <input type={'text'} placeholder={'Address'} value={userAddress}
                       onChange={(e) => setUserAddress(e.target.value)}/>
                <input type={'text'} placeholder={'City'} value={city} onChange={(e) => setCity(e.target.value)}/>
                <input type={'text'} placeholder={'ZIP code'} value={zip} onChange={(e) => setZip(e.target.value)}/>
                <input type={'text'} placeholder={'Region or Province (optional)'} value={region}
                       onChange={(e) => setRegion(e.target.value)}/>
                <input type={'text'} placeholder={'Phone number (optional)'} value={phone}
                       onChange={(e) => setPhone(e.target.value)}/>
                <button className={'button submit'} onClick={updateAddress}>Submit</button>
                <button className={'button back-button'} onClick={back}>Back</button>
            </div>
        </div>
    )
}

export default AddressDetails