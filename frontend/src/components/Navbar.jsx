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

            const token = sessionStorage.getItem('token');
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
            UserService.logout();
            window.location.reload();
    };



    return (
        <nav className="w-full bg-zinc-800 text-white py-4 shadow-lg">
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

                <Link to="/wiadomosci">
                    <div>Wiadomości</div>
                </Link>
                <Link to="/forum">
                    <div>Forum</div>
                </Link>
                <Link to="/tabela">Tabela</Link>
                <Link to="/kluby">Kluby</Link>
                {isAuthenticated && (
                    <Link to="/profil">Profil</Link>
                )}

                {UserService.adminOnly() &&
                    <Link to="/admin-panel">
                    <div>Panel</div>
                </Link>
                }


                <div>
                {isAuthenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2"
                                    >
                                        Wyloguj się
                                    </button>
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