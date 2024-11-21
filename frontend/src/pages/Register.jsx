import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import backgroundImage from '../assets/background-img.jpg';



function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '', // Pole tylko frontendowe
        role: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Hasło i Powtórz hasło muszą być identyczne.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Przygotowanie danych bez confirmPassword
            const { confirmPassword, ...dataToSend } = formData;

            await UserService.register(dataToSend, token);

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: ''
            });

            alert('User registered successfully');
            navigate('/strona-glowna');

        } catch (error) {
            console.error('Error registering user: ', error);
            alert('An error occurred while registering user');
        }
    };

    return (
        <div
            className="h-screen w-full bg-cover bg-center"
            style={{backgroundImage: `url(${backgroundImage})`}}
        >
            <div className="flex items-center justify-center h-full">
                <div
                    className="bg-white bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-4xl w-1/4 flex flex-col">


                    <h1 className="text-gray-800 text-xl font-semibold mb-4 mt-5 text-center">Rejestracja</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="text-gray-800">Imię</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-gray-800">Nazwisko</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Hasło</label>
                            <input
                                type="password"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Powtórz hasło</label>
                            <input
                                type="password"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Miasto</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-gray-800">Rola</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-700 text-white py-2 rounded-lg mt-7 hover:bg-blue-600 transition-colors"
                        >
                            Zarejestruj się
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export { Register };