import '../styles/CartPage.css'
import {RiDeleteBin5Line} from 'react-icons/ri'
import React, {useEffect, useState} from "react"
import {axiosRequest} from "../APIs/AxiosClient"
import BasicSnackbar from "./BasicSnackbar";

const CartPage = () => {

    const [cart, setCart] = useState([])
    const [totalPrice, setTotalPrice] = useState(null)
    const [couponCode, setCouponCode] = useState('')
    const [open, setOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('')

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

    useEffect(() => {
        getCart()
    }, [])

    const getCart = () => {
        axiosRequest.get('/cart')
            .then(response => {
                setCart(response.data.cart)
                setTotalPrice(response.data.totalPrice)
            })
            .catch(error => {
                console.log(error)
                displaySnackbar('error', 'Server error')
            })
    }

    const removeItem = id => {
        axiosRequest.post(`remove-from-cart/${id}`)
            .then(response => {
                if (response.status === 200) {
                    getCart()
                }
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Could not remove item')
            })
    }

    const findCoupon = () => {
        if (couponCode === '')
            return

        axiosRequest.get(`/find-coupon/${couponCode}`)
            .then(response => {
                const coupon = response.data[0]
                const total = document.getElementById('total')
                total.innerText = parseInt(total.innerText) - parseInt(total.innerText) * coupon.discount / 100
                displaySnackbar('success', 'Coupon applied')
            })
            .catch(error => {
                displaySnackbar('error', 'Invalid coupon code')
                console.error(error)
            })
    }

    const placeOrder = () => {
        axiosRequest.post('/place-order', {
            cart: cart
        })
            .then(response => {
                displaySnackbar('success', 'Order successfully created')
            })
            .catch(error => {
                displaySnackbar('error', 'Server error')
                console.error(error)
            })
    }

    return (
        <div className={'cart-main'}>
            <div className={'cart-container'}>
                <table>
                    <thead>
                    <tr>
                        <td>Remove</td>
                        <td>Image</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Quantity</td>
                        <td>Total</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        cart?.length === 0
                            ? <p>Shopping cart empty</p>
                            : cart?.map(item => {
                                return (
                                    <tr key={item.id} id={item.id}>
                                        <td onClick={() => removeItem(item.id)} className={'remove-from-cart'}>
                                            <RiDeleteBin5Line/></td>
                                        <td><img src={item.images[0].img_url} alt={'product'}/></td>
                                        <td><h5>{item.name}</h5></td>
                                        <td><h5>{item.price}€</h5></td>
                                        <td><h5>{item.quantity}x</h5></td>
                                        <td><h5>{item.price * item.quantity}€</h5></td>
                                    </tr>
                                )
                            })
                    }
                    </tbody>
                </table>
            </div>
            <div className={'cart-bottom'}>
                <div className={'coupon'}>
                    <div>
                        <h5>COUPON</h5>
                        <p>Enter your coupon code if you have one.</p>
                        <input type={'text'} placeholder={'Coupon Code'}
                               onChange={(e) => setCouponCode(e.target.value)}/>
                        <button className={'button apply-button'} onClick={findCoupon}>APPLY</button>
                    </div>
                </div>
                <div className={'price'}>
                    <div>
                        <h5>CART TOTAL</h5>
                        <div className={'subtotal'}>
                            <h6>Subtotal</h6>
                            <p>{totalPrice?.price}€</p>
                        </div>
                        <div className={'shipping'}>
                            <h6>Shipping</h6>
                            <p>{totalPrice?.shipping}€</p>
                        </div>
                        <div className={'total'}>
                            <h6>Total</h6>
                            <p><p id={'total'}>{totalPrice?.price + totalPrice?.shipping}</p>€</p>
                        </div>
                        <div className={'checkout-button'}>
                            <button className={'button'} onClick={placeOrder}>PLACE ORDER</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'snackbar'}>
                <BasicSnackbar open={open} onClose={handleClose} severity={snackbarSeverity} message={snackbarMessage}/>
            </div>
        </div>
    )
}

export default CartPage