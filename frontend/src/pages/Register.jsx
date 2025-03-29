import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import backgroundImage from '../assets/bvb-stadion.jpg';
import NewsletterService from "../service/NewsletterService.js";



function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '', // Pole tylko frontendowe
        // role: '',
        newsletter: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Hasło i Powtórz hasło muszą być identyczne.');
            return;
        }

        try {
            const { confirmPassword, newsletter, ...dataToSend } = formData;

            await UserService.register(dataToSend);

            if (newsletter) {

                NewsletterService.startNewsletter(formData);
                // await fetch('http://localhost:3001/newsletter', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ email: formData.email, firstName: formData.firstName, lastName: formData.lastName })
                // });
            }

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                // role: '',
                newsletter: false
            });

            alert('Rejestracja przebiegła pomyślnie');
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
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
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
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
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
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
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
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
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
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
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
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/*<div className="mt-3">*/}
                        {/*    <label className="text-gray-800">Rola</label>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"*/}
                        {/*        name="role"*/}
                        {/*        value={formData.role}*/}
                        {/*        onChange={handleInputChange}*/}
                        {/*        required*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="mt-3">
                            <label className="text-gray-800">Chcę otrzymywać newsletter</label>
                            <input
                                type="checkbox"
                                className="ml-2"
                                name="newsletter"
                                checked={formData.newsletter}
                                onChange={handleInputChange}
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

export {Register};