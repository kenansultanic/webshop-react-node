import '../styles/AdminPage.css'
import {HiOutlineUsers} from 'react-icons/hi'
import {RiTShirt2Line} from 'react-icons/ri'
import {BiEuro} from 'react-icons/bi'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import {AiOutlineArrowRight} from 'react-icons/ai'
import {BsTrash} from 'react-icons/bs'
import React, {useEffect, useState} from "react";
import AddNewProduct from "./AddNewProduct";
import EditProduct from "./EditProduct";
import {useNavigate} from "react-router";
import useLogout from "../hooks/useLogout";
import BasicSnackbar from './BasicSnackbar'
import {axiosRequest} from "../APIs/AxiosClient";

const AdminPage = () => {

    const navigate = useNavigate()
    const logout = useLogout()

    const [coupons, setCoupons] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [newProducts, setNewProducts] = useState([])
    const [allOrders, setAllOrders] = useState([])
    const [newOrders, setNewOrders] = useState([])
    const [siteStatistics, setSiteStatistics] = useState({})

    const [dashboard, setDashboard] = useState(true)
    const [products, setProducts] = useState(false)
    const [newProduct, setNewProduct] = useState(false)
    const [orders, setOrders] = useState(false)
    const [newsletter, setNewsletter] = useState(false)
    const [coupon, setCoupon] = useState(false)

    const toggle = (first, second, third, fourth, fifth, sixth) => {
        first(true)
        second(false)
        third(false)
        fourth(false)
        fifth(false)
        sixth(false)
        setEdit(false)
    }

    const toggleDashboard = () => toggle(setDashboard, setProducts, setNewProduct, setNewsletter, setOrders, setCoupon)
    const toggleProducts = () => toggle(setProducts, setDashboard, setNewProduct, setNewsletter, setOrders, setCoupon)
    const toggleNewProduct = () => toggle(setNewProduct, setDashboard, setProducts, setNewsletter, setOrders, setCoupon)
    const toggleOrders = () => toggle(setOrders, setDashboard, setProducts, setNewProduct, setNewsletter, setCoupon)
    const toggleNewsletter = () => toggle(setNewsletter, setDashboard, setProducts, setNewProduct, setOrders, setCoupon)
    const toggleCoupon = () => toggle(setCoupon, setNewsletter, setDashboard, setProducts, setNewProduct, setOrders)

    const [newCoupon, setNewCoupon] = useState('')
    const [couponDate, setCouponDate] = useState('')
    const [couponDiscount, setCouponDiscount] = useState('')
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [open, setOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('')

    const [edit, setEdit] = useState(false)
    const [editID, setEditID] = useState('')

    useEffect(() => {
        getCoupons()
        getProducts()
        getOrders()
        getDashboardStatistics()
    }, [])

    const getCoupons = () => {
        axiosRequest.get('/coupons')
            .then(response => {
                setCoupons(response.data)
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Server error')
            })
    }

    const getProducts = () => {
        axiosRequest.get('/get-all-products')
            .then(response => {
                setAllProducts(response.data)
                setNewProducts(response.data.slice(0, 10))
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Server error')
            })
    }

    const addNewCoupon = () => {
        if (coupons.find(c => c.coupon === newCoupon))
            return
        axiosRequest.post('/new-coupon', {
            coupon: newCoupon,
            discount: couponDiscount,
            validUntil: couponDate
        }).then(response => {
            getCoupons()
            displaySnackbar('info', 'Coupon added')
        })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Coupon already exists')
            })
    }

    const deleteCoupon = id => {
        axiosRequest.post(`/delete-coupon/${id}`)
            .then(response => {
                getCoupons()
            })
            .catch(error => {
                console.log(error)
                displaySnackbar('error', 'Server error')
            })
    }

    const deleteProduct = id => {
        axiosRequest.post('/delete/product', {
            productId: id
        }).then((response) => {
            if (response.data === 200)
                getProducts()
        }, (error) => {
            console.log(error)
            displaySnackbar('error', 'Server error')
        })
    }

    const sendEmail = () => {
        axiosRequest.post('/newsletter', {
            text: newsletterEmail
        })
            .then(response => {
                displaySnackbar('success', 'Messages sent')
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Server error, could not send messages')
            })
    }

    const getDashboardStatistics = () => {
        axiosRequest.get('/dashboard-statistics')
            .then(response => {
                setSiteStatistics(response.data[0])
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Server error')
            })
    }

    const getOrders = () => {
        axiosRequest.get('/all-orders')
            .then(response => {
                setAllOrders(response.data)
                setNewOrders(response.data.slice(0, 10))
            })
            .catch(error => {
                console.error(error)
                displaySnackbar('error', 'Server error')
            })
    }

    const displaySnackbar = (severity, message) => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpen(true)
    }

    const signOut = async () => {
        navigate('/')
        await logout()
    }

    const editProduct = id => {
        setEditID(id)
        setEdit(true)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return
        setOpen(false)
    }

    return (
        <div className={'admin-main'}>
            <div className={'sidebar'}>
                <div className={'sidebar-title'}>
                    <h2>WebShop</h2>
                </div>
                <div className={'sidebar-menu'}>
                    <ul>
                        <li className={dashboard ? 'sidebar-active' : ''} onClick={toggleDashboard}>Dashboard</li>
                        <li className={products ? 'sidebar-active' : ''} onClick={toggleProducts}>Products</li>
                        <li className={newProduct ? 'sidebar-active' : ''} onClick={toggleNewProduct}>Add new</li>
                        <li className={orders ? 'sidebar-active' : ''} onClick={toggleOrders}>Orders</li>
                        <li className={newsletter ? 'sidebar-active' : ''} onClick={toggleNewsletter}>Newsletter</li>
                        <li className={coupon ? 'sidebar-active' : ''} onClick={toggleCoupon}>Coupons</li>
                    </ul>
                </div>
            </div>
            <div className={'main-content'}>
                <header>
                    <h2>ADMIN</h2>
                    <div className={'user-wrapper'}>
                        <h4 className={'logout'} onClick={signOut}>Logout</h4>
                    </div>
                </header>
                <main>
                    <div className={dashboard ? 'dashboard admin-active' : 'dashboard'}>
                        <div className={'cards-group'}>
                            <div className={'card-single'}>
                                <div>
                                    <h1>{siteStatistics?.customers}</h1>
                                    <span>Customers</span>
                                </div>
                                <div className={'card-icon'}>
                                    <HiOutlineUsers/>
                                </div>
                            </div>
                            <div className={'card-single'}>
                                <div>
                                    <h1>{siteStatistics?.products}</h1>
                                    <span>Products</span>
                                </div>
                                <div className={'card-icon'}>
                                    <RiTShirt2Line/>
                                </div>
                            </div>
                            <div className={'card-single'}>
                                <div>
                                    <h1>{siteStatistics?.orders}</h1>
                                    <span>Orders</span>
                                </div>
                                <div className={'card-icon'}>
                                    <AiOutlineShoppingCart/>
                                </div>
                            </div>
                            <div className={'card-single'}>
                                <div>
                                    <h1>{siteStatistics?.income}</h1>
                                    <span>Income</span>
                                </div>
                                <div className={'card-icon'}>
                                    <BiEuro/>
                                </div>
                            </div>
                        </div>
                        <div className={'recent-grid'}>
                            <div className={'new-products-div'}>
                                <div>
                                    <div className={'card-header'}>
                                        <h3>New products</h3>
                                        <button onClick={toggleProducts}>See all <span className={'show-all-button'}><AiOutlineArrowRight/></span>
                                        </button>
                                    </div>
                                    <div className={'card-body'}>
                                        <div className={'table-responsive'}>
                                            <table className={'new-products'}>
                                                <thead>
                                                <tr>
                                                    <td>Product name</td>
                                                    <td>Product price</td>
                                                    <td>Quantity available</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    newProducts.map(product => {
                                                        return (
                                                            <tr key={product.id}>
                                                                <td>{product.name}</td>
                                                                <td>{product.price}</td>
                                                                <td>{product.quantity}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={'new-orders-div'}>
                                <div>
                                    <div className={'card-header'}>
                                        <h3>New orders</h3>
                                        <button onClick={toggleOrders}>See all <span className={'show-all-button'}><AiOutlineArrowRight/></span>
                                        </button>
                                    </div>
                                    <div className={'card-body'}>
                                        <div className={'table-responsive'}>
                                            <table className={'new-products'}>
                                                <thead>
                                                <tr>
                                                    <td>Order ID</td>
                                                    <td>Order status</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    newOrders.map(order => {
                                                        return (
                                                            <tr key={order.id}>
                                                                <td>{order.id}</td>
                                                                <td>{order.order_status}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={products ? 'products admin-active' : 'products'}>
                        <table className={!edit ? 'new-products new-products-display' : 'new-products hide-products'}>
                            <thead>
                            <tr>
                                <td>Name</td>
                                <td>Price</td>
                                <td>Quantity</td>
                                <td>Type</td>
                                <td>Discard</td>
                                <td>Edit</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                allProducts.map(product => {
                                    return (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.type}</td>
                                            <td className={'discard'} onClick={() => deleteProduct(product.id)}>
                                                <BsTrash/></td>
                                            <td className={'product-edit-button'}>
                                                <button onClick={() => editProduct(product.id)}>Edit</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className={orders ? 'orders admin-active' : 'orders'}>
                        <table>
                            <thead>
                            <tr>
                                <td>ID</td>
                                <td>User ID</td>
                                <td>Date</td>
                                <td>Status</td>
                                <td>Total</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                allOrders.map(orders => {
                                    return (
                                        <tr key={orders.id}>
                                            <td>{orders.id}</td>
                                            <td>{orders.user_id}</td>
                                            <td>{new Date(orders.order_date).toLocaleDateString('en-GB')}</td>
                                            <td>{orders.order_status}</td>
                                            <td>{orders.total}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className={newProduct ? 'new-product-display' : 'new-product-hide'}>
                        <AddNewProduct displaySnackBar={displaySnackbar}/>
                    </div>
                    <div className={newsletter ? 'newsletter admin-active' : 'newsletter'}>
                        <textarea maxLength={300} placeholder={'WRITE EMAIL'}
                                  onChange={(e) => setNewsletterEmail(e.target.value)}/>
                        <button className={'button'} onClick={sendEmail}>SEND</button>
                    </div>
                    <div className={coupon ? 'coupon-hidden coupon-active' : 'coupon-hidden'}>
                        <div className={'coupon-table'}>
                            <table className={'new-products'}>
                                <thead>
                                <tr>
                                    <td>Coupon</td>
                                    <td>Discount</td>
                                    <td>Valid until</td>
                                    <td>Number of uses</td>
                                    <td>Discard</td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    coupons.map(coupon => {
                                        return (
                                            <tr key={coupon.id}>
                                                <td>{coupon.coupon}</td>
                                                <td>{coupon.discount}%</td>
                                                <td>{coupon.valid_until.substring(0, 10)}</td>
                                                <td>{coupon.number_of_uses}</td>
                                                <td className={'discard'} onClick={() => deleteCoupon(coupon.id)}>
                                                    <BsTrash/></td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className={'new-coupon'}>
                            <input type={'text'} placeholder={'NEW COUPON'}
                                   onChange={(e) => setNewCoupon(e.target.value)}/><br/>
                            <input type={'number'} min={5} placeholder={'DISCOUNT'}
                                   onChange={(e) => setCouponDiscount(e.target.value)}/><br/>
                            <input placeholder={'VALID UNTIL'} onChange={(e) => setCouponDate(e.target.value)}
                                   onFocus={(e) => (e.target.type = 'date')}
                                   onBlur={(e) => (e.target.type = 'text')}/><br/>
                            <button className={'button'} onClick={addNewCoupon}>SAVE</button>
                        </div>
                    </div>
                    <div className={edit ? 'edit-product admin-active' : 'edit-product'}>
                        {
                            edit ? <EditProduct id={editID} setEdit={setEdit}/> : ''
                        }
                    </div>
                </main>
            </div>
            <div className={'snackbar'}>
                <BasicSnackbar open={open} onClose={handleClose} severity={snackbarSeverity} message={snackbarMessage}/>
            </div>
        </div>
    )
}

export default AdminPage