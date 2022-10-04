import '../styles/HomePage.css'
import {BiShoppingBag} from "react-icons/bi";
import {GrClose} from 'react-icons/gr'
import {BsStarFill, BsStarHalf, BsStar} from 'react-icons/bs'
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router'
import {axiosRequest} from "../APIs/AxiosClient";
import util from "../utils/util-functions";

const HomePage = () => {

    const navigate = useNavigate()

    const [menu, setMenu] = useState(false)
    const [sizesVisible, setSizesVisible] = useState(false)
    const [colorsVisible, setColorsVisible] = useState(false)
    const [pricesVisible, setPricesVisible] = useState(false)
    const [selectedSizes, setSelectedSizes] = useState([])
    const [selectedColors, setSelectedColors] = useState([])

    const [priceFrom, setPriceFrom] = useState(0)
    const [priceTo, setPriceTo] = useState(100)
    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])

    const [products, setProducts] = useState([])
    const [shownProducts, setShownProducts] = useState([])

    useEffect(() => {
        getAllProducts()
    }, [])

    const toggleMenu = () => setMenu(!menu)
    const toggleSizes = () => setSizesVisible(!sizesVisible)
    const toggleColors = () => setColorsVisible(!colorsVisible)
    const togglePrices = () => setPricesVisible(!pricesVisible)

    const clearFilters = () => {
        selectedSizes.forEach(size => {
            document.getElementById(size).classList.remove('selected-size')
        })
        selectedColors.forEach(color => {
            document.getElementById(color).classList.remove('selected-color')
        })
        setSelectedSizes([])
        setSelectedColors([])
        setShownProducts(products)
    }

    const applyFilters = () => {
        setShownProducts(util.filterProducts(products, selectedColors, selectedSizes, priceFrom, priceTo))
    }

    const selectSize = size => {
        if (!selectedSizes.includes(size)) {
            selectedSizes.push(size)
            document.getElementById(size).classList.add('selected-size')
        } else {
            setSelectedSizes(selectedSizes.filter(x => x !== size))
            document.getElementById(size).classList.remove('selected-size')
        }
    }

    const selectColor = color => {
        if (!selectedColors.includes(color)) {
            selectedColors.push(color)
            document.getElementById(color).classList.add('selected-color')
        } else {
            setSelectedColors(selectedColors.filter(x => x !== color))
            document.getElementById(color).classList.remove('selected-color')
        }
    }

    const showProductDetails = id => {
        navigate(`/product/${id}`)
    }

    const filter = types => {
        if (types[0] === 'all')
            setShownProducts(products)
        else
            setShownProducts(util.filterByType(products, types))
    }

    const getAllProducts = () => {
        axiosRequest.get('/get-all-products')
            .then(response => {
                const products = response.data
                setProducts(products)
                setShownProducts(products)
                setSizes(util.getDistinctSizes(products))
                setColors(util.getDistinctColors(products))
            })
            .catch(err => {
                console.error(err)
            })
    }

    return (
        <div className={'home-page'}>
            <div className={'filter'}>
                <ul>
                    <li onClick={() => filter(['all'])}>View all</li>
                    <li onClick={() => filter(['shirt', 't-shirt'])}>Shirts</li>
                    <li onClick={() => filter(['hoodie', 'jumper', 'shirt'])}>Hoodies</li>
                    <li onClick={() => filter(['pants', 'jeans', 'trousers'])}>Pants</li>
                    <li onClick={() => filter(['shorts'])}>Shorts</li>
                    <li onClick={() => filter(['jacket', 'coat'])}>Jackets</li>
                    <li onClick={toggleMenu}>Filter</li>
                </ul>
            </div>
            <div className={menu ? 'filters-menu filters-menu-active' : 'filters-menu'}>
                <div onClick={toggleMenu} className={'icon'}><GrClose/></div>
                <ul>
                    <li onClick={toggleSizes}>SIZE</li>
                    <li className={sizesVisible ? 'sizes-hidden visible fade-in' : 'fade-out sizes-hidden'}>
                        <div className={'sizes'}>
                            {
                                sizes.map((size, i) => <div key={i} className={'size-item'} id={size}
                                                            onClick={() => selectSize(size)}>{size}</div>)
                            }
                        </div>
                    </li>
                    <li onClick={toggleColors}>COLOR</li>
                    <li className={colorsVisible ? 'colors-hidden visible fade-in' : 'fade-out colors-hidden'}>
                        <div className={'filter-colors'}>
                            {
                                colors.map((color, i) => <button className={'color-button'} key={i} id={color}
                                                                 style={{background: color}}
                                                                 onClick={() => selectColor(color)}/>)
                            }
                        </div>
                    </li>
                    <li onClick={togglePrices}>PRICE</li>
                    <li className={pricesVisible ? 'prices-hidden visible fade-in' : 'prices-hidden'}>
                        <div className={'prices'}>
                            <input type={'number'} min={'0'} placeholder={'From'} value={priceFrom}
                                   className={'price-input'} onChange={(e) => setPriceFrom(e.target.value)}/>
                            <input type={'number'} min={'0'} placeholder={'To'} value={priceTo}
                                   className={'price-input'} onChange={(e) => setPriceTo(e.target.value)}/>
                        </div>
                    </li>
                </ul>
                <div className={'view-results'} onClick={applyFilters}>VIEW RESULTS</div>
                <div className={'clear'} onClick={clearFilters}>CLEAR</div>
            </div>
            <div className={'homepage-products'}>
                <h2>FEATURED PRODUCTS</h2>
                <p>New Collection New Modern Design</p>
                <div className={'products-container'}>
                    {
                        shownProducts.length === 0
                            ? <p>No products matching current requirements</p>
                            : shownProducts.map(product => {
                                return (
                                    <div key={product.id} className={'product'}
                                         onClick={() => showProductDetails(product.id)}>
                                        <img src={product?.images[0]?.img_url} alt={'product'}/>
                                        <div className={'description'}>
                                            <span>{product.name}</span>
                                            <h5>{product.description.slice(0, 50)}...</h5>
                                            <div className={'star'}>
                                                <BsStarFill/>
                                                <BsStarFill/>
                                                <BsStarFill/>
                                                <BsStarHalf/>
                                                <BsStar/>
                                            </div>
                                            <h4>€{product.price}</h4>
                                        </div>
                                        <div className={'cart'}><BiShoppingBag/></div>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </div>
    )
}

export default HomePage