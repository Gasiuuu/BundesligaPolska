import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home.jsx";
import Footer from "./components/Footer";
import {Register} from "./pages/Register.jsx";
import {Login} from "./pages/Login.jsx";

function AppRoutes() {


    const renderLayout = (Component) => (
        <div className='App'>
            <div className='navbar'>
                <Navbar/>
            </div>
            <div className='content-wrapper'>
                {Component}
            </div>
            <div className='footer'>
                <Footer/>
            </div>
        </div>
    );

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/strona-glowna" />} />
                <Route path="/strona-glowna" element={renderLayout(<Home />)}/>
                <Route path="/logowanie" element={<Login />} />
                <Route path="/rejestracja" element={<Register />} />
                {/*<Route path="/profil" element={renderLayout(<ProfilePage />)} />*/}
            </Routes>
        </Router>
    );
}

export default AppRoutes;
