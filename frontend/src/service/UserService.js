import axios from "axios";

class UserService {

    static BASE_URL = "http://localhost:8080"


    static async login(email, password) {

        const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
        return response.data;
    }

    static async register(userData) {

        const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, {
        })
        return response.data;
    }


    /* auth checker */

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }
    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;