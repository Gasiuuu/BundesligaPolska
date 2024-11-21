import React, { useEffect } from "react";
import logo from '../assets/Bundesliga.jpg';
import {Link} from "react-router-dom";
import UserService from '../service/UserService';


function Navbar() {

    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();
    // console.log(isAuthenticated);



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
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Bundesliga logo"
                        className="w-9 h-7 mr-2"
                    />
                    <h1 className="text-gray-100 text-2xl font-bold">BUNDESLIGA POLSKA</h1>
                </div>

                <div>
                    {isAuthenticated ? (
                        <button onClick={handleLogout}>
                            Wyloguj się
                        </button>
                    ) : (
                        <Link to="/logowanie">
                            <h5>Zaloguj się</h5>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;