import './App.css';
import {BrowserRouter as Router} from "react-router-dom"
import {Routes, Route} from "react-router"
import RequireAuth from "./components/RequireAuth";
import IndexPage from "./components/IndexPage";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ProductOverview from "./components/ProductOverview";
import ProfilePage from "./components/ProfilePage";
import CartPage from "./components/CartPage";
import AdminPage from "./components/AdminPage";
import Layout from "./components/Layout";
import ForgotPassword from "./components/ForgotPassword";
import PersistLogin from "./components/PersistLogin";

const App = () => {

    return (
        <Routes>
            <Route path={'/'} element={<Layout/>}>
                <Route path={'/'} element={<IndexPage/>}/>
                <Route path={'/forgot-password'} element={<ForgotPassword/>}/>

                <Route element={<PersistLogin/>}>
                    <Route element={<><RequireAuth type={'user'}/><Navbar/></>}>
                        <Route path={'home'} element={<HomePage/>}/>
                        <Route path={'product/:id'} element={<ProductOverview/>}/>
                        <Route path={'user-profile'} element={<ProfilePage/>}/>
                        <Route path={'shopping-cart'} element={<CartPage/>}/>
                    </Route>
                    <Route element={<RequireAuth type={'admin'}/>}>
                        <Route path={'admin'} element={<AdminPage/>}/>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default App;
