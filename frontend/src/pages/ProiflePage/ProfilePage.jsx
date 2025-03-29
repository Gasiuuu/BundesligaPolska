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

            const token = sessionStorage.getItem('token');
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
            <p className="profile-info">Imię: {profileInfo.firstName}</p>
            <p className="profile-info">Nazwisko: {profileInfo.lastName}</p>
            <p className="profile-info">Email: {profileInfo.email}</p>
            <p className="profile-info">Miasto: {profileInfo.city}</p>
        </div>
    );
}

export default ProfilePage;