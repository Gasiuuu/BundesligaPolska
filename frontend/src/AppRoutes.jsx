import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home/Home.jsx";
import Footer from "./components/Footer";
import { Register } from "./pages/Register.jsx";
import { Login } from "./pages/Login.jsx";
import ProfilePage from "./pages/ProiflePage/ProfilePage.jsx";
import UpdatePage from "./pages/UpdatePage/UpdatePage.jsx";
import { Table } from "./pages/Table/Table.jsx";
import { Clubs } from "./pages/Clubs/Clubs.jsx"

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
                <Route path="/profil" element={renderLayout(<ProfilePage />)} />
                <Route path="/tabela" element={renderLayout(<Table />)} />
                <Route path="/update/{userId}" element={renderLayout(<UpdatePage />)} />
                <Route path="/kluby" element={renderLayout(<Clubs />)} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
