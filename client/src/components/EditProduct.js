import {useEffect, useState} from "react";
import axios from "axios";
import {axiosRequest} from "../APIs/AxiosClient";

const EditProduct = ({id, setEdit}) => {

    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productType, setProductType] = useState('')
    const [availableSizes, setAvailableSizes] = useState('')
    const [availableColors, setAvailableColors] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productKeywords, setProductKeywords] = useState('')
    const [quantity, setQuantity] = useState('')
    
    const [product, setProduct] = useState({})

    useEffect(() => {
        axiosRequest.get(`/product/${id}`)
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [id])

    const addProduct = () => {
        axios.post('http://localhost:4000/edit/product', {
            name: productName,
            price: productPrice,
            type: productType,
            colors: availableColors,
            sizes: availableSizes,
            quantity: quantity,
            keywords: productKeywords,
            description: productDescription
        }).then((response) => {
            //TODO("ZAVRSIT")
            if (response.data === 409)
                alert('Product already exists')
        }, (error) => {
            console.log(error)
        })
    }
    
    const getProduct = () => {
        axios.get('http://localhost:4000/product/' + id, {})
            .then(response => {
                setProduct(response.data)
                console.log(response.data)
            }, error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getProduct()
    }, [id])

    return (
        <div className={'new-product admin-active new-product-grid'}>
            <div>
                <input type={'text'} placeholder={'PRODUCT NAME'}
                       onChange={(e) => setProductName(e.target.value)}/>
                <input type={'text'} placeholder={'PRICE'}
                       onChange={(e) => setProductPrice(e.target.value)}/>
                <input type={'text'} placeholder={'AVAILABLE COLORS'}
                       onChange={(e) => setAvailableColors(e.target.value)}/>
                <input type={'text'} placeholder={'AVAILABLE SIZES'}
                       onChange={(e) => setProductKeywords(e.target.value)}/>
                <input type={'text'} placeholder={'KEYWORDS'}
                       onChange={(e) => setAvailableSizes(e.target.value)}/>
                <input type={'number'} min={1} placeholder={'QUANTITY AVAILABLE'}
                       onChange={(e) => setQuantity(e.target.value)}/>
            </div>
            <div>
                <label>
                    Type:
                    <select onChange={(e) => setProductType(e.target.value)}>
                        <option>T-shirt</option>
                        <option>Hoodie</option>
                        <option>Trousers</option>
                        <option>Jeans</option>
                        <option>Shirt</option>
                        <option>Jacket</option>
                        <option>Shorts</option>
                        <option>Coat</option>
                        <option>Shoes</option>
                        <option>Accessories</option>
                    </select>
                </label>
                <textarea maxLength={200} placeholder={'DESCRIPTION'}
                          onChange={(e) => setProductDescription(e.target.value)}/>
                <button className={'button add-button'} onClick={addProduct}>EDIT</button>
                <button className={'button edit-button'} onClick={() => setEdit(false)}>BACK</button>
            </div>
        </div>
    )
}

export default EditProduct