import React,{useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import UserService from "../service/UserService";
import backgroundImage from '../assets/background-img.jpg';
import facebook from '../assets/facebook.png';
import google from '../assets/google.png';
import mail from '../assets/mail.png';
import logo from '../assets/Bundesliga.jpg';




function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await UserService.login(email, password)
            if(userData.refreshToken) {
                localStorage.setItem('token', userData.refreshToken)
                // console.log(userData)
                navigate('/strona-glowna')
            } else {
                setError(userData.error)
            }

        } catch(error) {
            console.log(error)
            setError(error)
            setTimeout(() => {
                setError('');
            }, 5000)
        }
    }


    return (
        <div
            className="h-screen w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="flex items-center justify-center h-full">
                <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-4xl w-full flex">

                    {/* Lewa strona z przyciskami */}
                    <div className="w-1/2 p-6 border-r border-gray-300">
                        <h2 className="text-gray-800 text-xl font-semibold mb-4 mt-14 text-center">Zarejestruj się</h2>
                        <div className="space-y-4">
                            <button
                                className="w-full flex items-center justify-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition">
                                <img src={google} alt="Google" className="w-6 h-6 mr-3"/>
                                <span className="text-gray-800">Google</span>
                            </button>
                            <button
                                className="w-full flex items-center justify-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition">
                                <img src={facebook} alt="Facebook" className="w-6 h-6 mr-3"/>
                                <span className="text-gray-800">Facebook</span>
                            </button>
                            <button
                                className="w-full flex items-center justify-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition">
                                <Link to="/rejestracja" className="flex items-center">
                                    <img src={mail} alt="Email" className="w-6 h-6 mr-3"/>
                                    <span className="text-gray-800">Email</span>
                                </Link>
                            </button>
                        </div>
                    </div>

                    <div className="w-1/2 p-6 flex flex-col items-center justify-center">

                        <div className="flex items-center mb-6">
                            <img
                                src={logo}
                                alt="Bundesliga logo"
                                className="w-9 h-7 mr-2"
                            />
                            <h1 className="text-gray-800 text-2xl font-bold">BUNDESLIGA POLSKA</h1>
                        </div>

                        <h2 className="text-gray-800 text-xl font-semibold mb-4 text-center">Zaloguj się</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="text-gray-800">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="text-gray-800">Hasło</label>
                                <input
                                    type="password"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="text-right">
                                <a href="#" className="text-blue-700 text-sm hover:underline">Zapomniałeś hasła?</a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-700 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors"
                                onSubmit={handleSubmit}
                            >
                                Zaloguj się
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export { Login };