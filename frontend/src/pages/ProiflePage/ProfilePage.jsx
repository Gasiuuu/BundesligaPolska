import React, { useState, useEffect } from 'react';
import UserService from '../../service/UserService.js';
import { Link } from 'react-router-dom';
import './ProfilePage.css'


function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token');
            console.log("token: " + token);
            const response = await UserService.getYourProfile(token);
            console.log('Otrzymano profil:', response);
            setProfileInfo(response.userEntity);
            console.log(profileInfo);

        } catch (error) {
            console.error('Error fetching profile information: ', error);
        }
    };

    return (
        <div className="profile-page-container">
            <h1>Profil</h1>
            <p>Imię: {profileInfo.firstName}</p>
            <p>Nazwisko: {profileInfo.lastName}</p>
            <p>Email: {profileInfo.email}</p>
            <p>Miasto: {profileInfo.city}</p>
            {profileInfo.role === "ADMIN" && (
                <button><Link to={`/update/${profileInfo.id}`}>Update This Profile</Link></button>
            )}
        </div>
    );
}

export default ProfilePage;