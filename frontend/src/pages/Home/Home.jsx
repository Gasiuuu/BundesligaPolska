import React, { useState, useEffect } from 'react';
import UserService from "../../service/UserService.js";
import './Home.css'


function Home() {

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

    return(
        <div>
            <h1>Cześć, {profileInfo.firstName}!</h1>
        </div>
    );
}

export { Home };

