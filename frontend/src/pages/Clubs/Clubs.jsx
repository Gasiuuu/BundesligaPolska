import react, { useState, useEffect } from 'react';
import axios from 'axios';
import './Clubs.css'
import {Link} from "react-router-dom";

function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState(null);

    const stadionsImg = []

    const API_URL = "/api/v4/competitions/2002/teams";
    const API_KEY = "127551c0af124e58b5a8c863606377b0";

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        "X-Auth-Token": API_KEY,
                    },
                });
                setClubs(response.data.teams);

            } catch(error) {
                setError("Nie udało się załadować klubów.");
            }

        }
        fetchClubs();
    })

    return(
        <div className="clubs-container2">
            <h1 className="clubs-header">KLUBY</h1>
            <div className="clubs-container">
                {clubs.map((club) => (
                    <Link to="/">
                        <div
                            key={club.id}
                            className="club"
                            id={`club-${club.id}`}
                        >
                            {/*<p>{club.id}</p>*/}
                            <img className="club-img" src={club.crest} alt={club.name}/>
                            <h3 className="club-name">{club.name}</h3>
                            <img
                                src={stadionsImg[club.id] || 'https://example.com/default.jpg'}
                                alt={`Additional for ${club.name}`}
                                className="unique-img"
                            />

                        </div>
                    </Link>

                    )
                )}
            </div>
        </div>
    );
}

export { Clubs };