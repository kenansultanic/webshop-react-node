import '../styles/ProductOverview.css'
import React, {createRef, useEffect, useState} from "react";
import {useParams} from "react-router";
import {axiosRequest} from "../APIs/AxiosClient";
import DetailsThumb from "./product-overview/DetailsThumb";
import BasicSnackbar from "./BasicSnackbar";

const ProductOverview = () => {

    const {id} = useParams()
    const productRef = createRef()
    const [product, setProduct] = useState(null)
    const [index, setIndex] = useState(0)

    const [size, setSize] = useState(null)
    const [color, setColor] = useState(null)
    const [quantity, setQuantity] = useState(1)
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
        const getProduct = async () => {
            const {data} = await axiosRequest.get(`/product/${id}`)
            setProduct(data)
            console.log('DATA', data)
        }
        getProduct()
    }, [])

    const handleTab = index => {
        setIndex(index)
        const images = productRef.current.children
        for (let i = 0; i < images.length; i++) {
            images[i].className = images[i].className.replace('active', '')
        }
        images[index].className = 'active'
    }

    const selectSize = selectedSize => {
        if (selectedSize === size) {
            document.getElementById(selectedSize).classList.remove('selected-size')
            setSize(null)
        } else {
            document.getElementById(selectedSize).classList.add('selected-size')
            if (size)
                document.getElementById(size.toString()).classList.remove('selected-size')
            setSize(selectedSize)
        }
    }

    const selectColor = selectedColor => {
        if (selectedColor === color) {
            document.getElementById(selectedColor).classList.remove('selected-color')
            setColor(null)
        } else {
            document.getElementById(selectedColor).classList.add('selected-color')
            if (color)
                document.getElementById(color.toString()).classList.remove('selected-color')
            setColor(selectedColor)
        }
    }

    const addToCart = () => {
        if (!size || !color || !quantity) {
            displaySnackbar('error', 'You need to select a size, color and quantity')
            return
        }

        axiosRequest.post('/add-to-cart', {
            product: product,
            color: color,
            size: size,
            quantity: quantity
        })
            .then(response => {
                console.log(response)
                displaySnackbar('success', 'Item added to cart')
            })
            .catch(error => {
                console.log(error)
                displaySnackbar('error', 'Could not add item to cart')
            })
    }

    return (
        <div className="app">
            {
                product?
                    <div className="products-details">
                        <div className="big-img">
                            <img src={product.images[index].img_url} alt=""/>
                        </div>
                        <div className="box">
                            <div className="row">
                                <h2>{product.name}</h2>
                                <span>{product.price}€</span>
                            </div>
                            <div className="colors">
                                {
                                    product.colors?.length === 0
                                        ? <p>No colors available</p>
                                        : product.colors?.map((item, i) => (
                                            <button id={item.color} style={{background: item.color}} key={i}
                                                    onClick={() => selectColor(item.color)}/>
                                        ))
                                }
                            </div>
                            <div className={'sizes'}>
                                {
                                    product.sizes?.length === 0
                                        ? <p>No sizes available</p>
                                        : product.sizes?.map((item, i) => <div className={'size-item'} id={item.size}
                                                                                key={i}
                                                                                onClick={() => selectSize(item.size)}>{item.size}</div>)
                                }
                            </div>

                            <p>{product.description}</p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            </p>

                            <DetailsThumb images={product.images} tab={handleTab} myRef={productRef}/>
                            <label>
                                Quantity
                                <input type={'number'} placeholder={'QUANTITY'} min={1} value={quantity}
                                       onChange={(e) => setQuantity(e.target.value)}/>
                            </label>
                            <button className="button" onClick={addToCart}>Add to cart</button>
                        </div>
                    </div>
                    : <p>Loading</p>
            }
            <div className={'snackbar'}>
                <BasicSnackbar open={open} onClose={handleClose} severity={snackbarSeverity} message={snackbarMessage}/>
            </div>
        </div>
    )
}

export default ProductOverview