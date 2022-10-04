import '../styles/Navbar.css'
import {BiShoppingBag} from 'react-icons/bi'
import {MdOutlineAccountCircle} from 'react-icons/md'
import {BiSearch} from 'react-icons/bi'
import {AiOutlineHome} from 'react-icons/ai'
import {useState} from "react"
import {Link} from "react-router-dom"
import {useLocation} from "react-router"

const Navbar = () => {

    const location = useLocation()
    const [account, setAccount] = useState(false)
    const [search, setSearch] = useState(false)
    const toggleAccount = () => setAccount(!account)
    const toggleSearch = () => setSearch(!search)

    return (
        <header className={'navbar-header'}>
            <div className={'navbar'}>
                <div className={'icons'}>
                    <div className={'icon'}>
                        <Link to={'/shopping-cart'}><BiShoppingBag/></Link>
                    </div>
                    <div className={'icon'}>
                        <Link to={'/home'}><AiOutlineHome/></Link>
                    </div>
                    <div className={'icon'} onClick={toggleAccount}>
                        <Link to={'/user-profile'}><MdOutlineAccountCircle/></Link>
                    </div>
                    {
                        location.pathname === '/home'
                            ?
                            <>
                                <div className={'icon'} onClick={toggleSearch}>
                                    <BiSearch/>
                                </div>
                                <div className={search ? 'icon' : 'hide'}>
                                    <div className={'search-wrapper'}>
                                        <input type={'search'} placeholder={'Search here'}/>
                                        <div className={'search-icon'}><BiSearch/></div>
                                    </div>
                                </div>
                            </>
                            : <></>
                    }
                </div>
            </div>
        </header>
    )
}

export default Navbar