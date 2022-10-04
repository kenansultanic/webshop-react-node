import {useState} from "react";
import {BsPlus} from 'react-icons/bs'
import {BsTrash} from 'react-icons/bs'
import {AiOutlineFileImage} from 'react-icons/ai'
import '../styles/AddNewProduct.css'
import {axiosRequest} from "../APIs/AxiosClient";

const AddNewProduct = ({displaySnackBar}) => {

    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productType, setProductType] = useState('')
    const [availableSizes, setAvailableSizes] = useState('')
    const [availableColors, setAvailableColors] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productKeywords, setProductKeywords] = useState('')
    const [quantity, setQuantity] = useState('')
    const [files, setFiles] = useState([])

    const removeFile = filename => {
        setFiles(files.filter(file => file.name !== filename))
    }

    const addFile = e => {
        const file = e.target.files[0]
        setFiles([...files, file])
    }

    const addProduct = () => {
        const formData = new FormData()
        files.forEach(file => {
            formData.append('images', file)
        })
        formData.append('name', productName)
        formData.append('price', productPrice)
        formData.append('colors', availableColors)
        formData.append('sizes', availableSizes)
        formData.append('quantity', quantity)
        formData.append('keywords', productKeywords)
        formData.append('description', productDescription)
        formData.append('type', productType)

        axiosRequest({
            url: '/add-product',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                displaySnackBar('success', 'New product added')
            })
            .catch(error => {
                displaySnackBar('error', 'Could not save product')
                console.error(error)
            })
    }

    return (
        <div className={'new-product admin-active new-product-grid'}>
            <div>
                <input type={'text'} placeholder={'PRODUCT NAME'}
                       onChange={(e) => setProductName(e.target.value)}/>
                <input type={'number'} placeholder={'PRICE'}
                       onChange={(e) => setProductPrice(e.target.value)}/>
                <input type={'text'} placeholder={'AVAILABLE COLORS'}
                       onChange={(e) => setAvailableColors(e.target.value)}/>
                <input type={'text'} placeholder={'AVAILABLE SIZES'}
                       onChange={(e) => setAvailableSizes(e.target.value)}/>
                <input type={'text'} placeholder={'KEYWORDS'}
                       onChange={(e) => setProductKeywords(e.target.value)}/>
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
                <div className={'file-card'}>
                    <div className={'file-inputs'}>
                        <input type={'file'} onChange={addFile}/>
                        <button>
                            <i>
                                <BsPlus/>
                            </i>
                            Upload
                        </button>
                    </div>
                </div>
                <ul className={'file-list'}>
                    {
                        files &&
                        files.map(file =>
                            <li className={'file-item'} key={file.name}>
                                <AiOutlineFileImage/>
                                <p>{file.name}</p>
                                <div className={'actions'}>
                                    <i onClick={() => removeFile(file.name)}>
                                        <BsTrash/>
                                    </i>
                                </div>
                            </li>
                        )
                    }
                </ul>
                <button className={'button add-button'} onClick={addProduct}>ADD</button>
            </div>
        </div>
    )
}

export default AddNewProduct