import React, { useEffect, useState } from "react";
import "./EditUser.css"
import {useParams} from "react-router-dom";
import UserService from "../../service/UserService.js";
import NewsService from "../../service/NewsService.js";
import backgroundImage from "../../assets/bvb-stadion.jpg";
import { useNavigate } from "react-router-dom";

function EditUser() {

    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        console.log(UserService.isAdmin())
        fetchUserById(userId)

    }, [userId]);

    const fetchUserById  = async (userId) => {
        const response = await UserService.getUserById(userId);
        console.log("odpowiedz w fetchUserById: ", response.userEntity)

        const { firstName, lastName, email, password, city, role } = response.userEntity;
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
        setPassword(password);
        setCity(city);
        setRole(role)

        setUser(response.userEntity);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const userEntity = {
            firstName,
            lastName,
            email,
            password,
            city,
            role,
        };


        const token = sessionStorage.getItem('token');
        console.log(token);

        await UserService.updateUser(userId, userEntity);

        console.log(userEntity);

        alert('Pomyślnie edytowano użytkownika!');
        navigate('/zarzadzanie-uzytkownikami');
    };

    return (
        <div
            className="h-screen w-full bg-cover bg-center"
            style={{backgroundImage: `url(${backgroundImage})`}}
        >
            <div className="flex items-center justify-center h-full">
                <div
                    className="bg-white bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-4xl w-1/4 flex flex-col">


                    <h1 className="text-gray-800 text-xl font-semibold mb-4 mt-5 text-center">Edytuj użytkownika</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="text-gray-800">Imię</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-gray-800">Nazwisko</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Hasło</label>
                            <input
                                type="password"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Miasto</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                                name="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Rola</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-700 text-white py-2 rounded-lg mt-7 hover:bg-blue-600 transition-colors"
                        >
                            Edytuj użytkownika
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default EditUser;