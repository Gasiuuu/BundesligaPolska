import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home/Home.jsx";
import Footer from "./components/Footer";
import { Register } from "./pages/Register.jsx";
import { Login } from "./pages/Login.jsx";
import ProfilePage from "./pages/ProiflePage/ProfilePage.jsx";
import EditUser from "./pages/EditUser/EditUser.jsx";
import { Table } from "./pages/Table/Table.jsx";
import { Clubs } from "./pages/Clubs/Clubs.jsx"
import NewsPage from "./pages/News/NewsPage.jsx";
import Article from "./pages/Article/Article.jsx";
import ArticleForm from "./pages/ArticleForm/ArticleForm.jsx";
import ClubPage from "./pages/ClubPage/ClubPage.jsx";
import UserService from "./service/UserService.js";
import AdminPanel from "./pages/AdminPanel/AdminPanel.jsx";
import ForumPage from "./pages/ForumPage/ForumPage.jsx";
import NewsManagement from "./pages/NewsManagement/NewsManagement.jsx";
import EditNews from "./pages/EditNews/EditNews.jsx";
import UserManagement from "./pages/UserManagement/UserManagement.jsx";

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
                <Route path="/edytuj-uzytkownika/:userId" element={<EditUser />} />
                <Route path="/kluby" element={renderLayout(<Clubs />)} />
                <Route path="/wiadomosci" element={renderLayout(<NewsPage />)} />
                <Route path="/wiadomosci/:newsId" element={renderLayout(<Article />)} />
                <Route path="/kluby/:clubId" element={renderLayout(<ClubPage />)} />
                <Route path="/forum" element={renderLayout(<ForumPage />)} />
                {UserService.adminOnly() && (
                    <>
                        <Route path="/dodaj-artykul" element={renderLayout(<ArticleForm />)} />
                        <Route path="/admin-panel" element={renderLayout(<AdminPanel />)} />
                        <Route path="/zarzadzanie-artykulami" element={renderLayout(<NewsManagement />)} />
                        <Route path="/zarzadzanie-uzytkownikami" element={renderLayout(<UserManagement />)} />
                        <Route path="/edytuj-artykul/:newsId" element={renderLayout(<EditNews />)} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default AppRoutes;
