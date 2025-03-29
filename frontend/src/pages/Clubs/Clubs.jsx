import react, { useState, useEffect } from 'react';
import axios from 'axios';
import './Clubs.css'
import {Link} from "react-router-dom";
const apiKey = import.meta.env.VITE_API_KEY;


function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState(null);

    const API_URL = "/api/v4/competitions/2002/teams";

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        "X-Auth-Token": apiKey,
                    },
                });
                setClubs(response.data.teams);
                console.log(response.data);

            } catch(error) {
                setError("Nie udało się załadować klubów.");
            }

        }
        fetchClubs();
    }, [])

    return(
        <div className="clubs-container2">
            <h1 className="clubs-header">KLUBY</h1>
            <div className="clubs-container">
                {clubs.map((club) => (
                    <Link to={`/kluby/${club.id}`} key={club.id}>
                        <div
                            key={club.id}
                            className="club"
                            id={`club-${club.id}`}
                        >
                            {/*<p>{club.id}</p>*/}
                            <img className="club-img" src={club.crest} alt={club.name}/>
                            <h3 className="club-name">{club.name}</h3>

                        </div>
                    </Link>

                    )
                )}
            </div>
        </div>
    );
}

export { Clubs };