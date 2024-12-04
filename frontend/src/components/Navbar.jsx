import React, {useEffect, useState} from "react";
import logo from '../assets/Bundesliga.jpg';
import {Link} from "react-router-dom";
import UserService from '../service/UserService';


function Navbar() {

    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token');
            // console.log("token: " + token);
            const response = await UserService.getYourProfile(token);
            // console.log('Otrzymano profil:', response);
            setProfileInfo(response.userEntity);
            // console.log(profileInfo);

        } catch (error) {
            console.error('Error fetching profile information: ', error);
        }
    };


    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
            window.location.reload();
        }
    };



    return (
        <nav className="w-full bg-zinc-700 text-white py-4">
            <div className="flex items-center justify-between px-6">
                <Link to="/">
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Bundesliga logo"
                        className="w-9 h-7 mr-2"
                    />
                    <h1 className="text-gray-100 text-2xl font-bold">BUNDESLIGA POLSKA</h1>
                </div>
                </Link>

                <div>Wiadomości</div>
                <div>Forum</div>
                <Link to="/tabela">Tabela</Link>
                <Link to="/kluby">Kluby</Link>
                {isAuthenticated}
                <Link to="/profil">Profil</Link>
                {isAdmin}
                <div>Panel</div>

                <div>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            {/* Awatar i nick */}
                            <img
                                src={profileInfo.avatar || "https://via.placeholder.com/30"} // Domyślny awatar
                                alt="Avatar użytkownika"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="relative group">
                                <button className="text-white focus:outline-none">
                                    {profileInfo.firstName} ▼
                                </button>
                                {/* Menu rozwijane */}
                                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md hidden group-hover:block">
                                    <Link to="/profil" className="block px-4 py-2 hover:bg-gray-200">
                                        Profil
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Wyloguj się
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/logowanie" className="hover:text-gray-300">
                            <h5>Zaloguj się</h5>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;