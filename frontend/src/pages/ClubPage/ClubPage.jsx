import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './ClubPage.css';
import axios from "axios";
const apiKey = import.meta.env.VITE_API_KEY;


function ClubPage() {

    const { clubId } = useParams();
    const [club, setClub] = useState(null);
    const [error, setError] = useState(null);

    const API_URL = `/api/v4/competitions/2002/teams`;

    const fetchClubs = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    "X-Auth-Token": apiKey  ,
                },
            });
            console.log(response.data.teams);

            const foundClub = response.data.teams.find(team => team.id === parseInt(clubId));

            if (foundClub) {
                setClub(foundClub);
            } else {
                setError("Nie znaleziono klubu o podanym ID.");
            }

            console.log(foundClub);

        } catch (error) {
            setError("Nie udało się załadować danych klubu.");
        }

    }

    useEffect(() => {
        fetchClubs();
    }, [clubId]);


    if (!club) {
        return <div className="loading-message">Ładowanie danych klubu...</div>;
    }

    return (
        <div className="club-page">
            <img src={club.crest} alt={club.name} className="club-crest"/>
            <h1 className="club-header">{club.name}</h1>

            <div className="info-row">
                <strong className="info-label">Stadion:</strong>
                <span className="info-value">{club.venue}</span>
            </div>
            <div className="info-row">
                <strong className="info-label">Rok założenia:</strong>
                <span className="info-value">{club.founded}r.</span>
            </div>
            <div className="info-row">
                <strong className="info-label">Trener:</strong>
                <span className="info-value">{club.coach.name} ({club.coach.nationality})</span>
            </div>
            <div className="info-row">
                <strong className="info-label">Kontrakt trenera do:</strong>
                <span className="info-value">{club.coach.contract.until}</span>
            </div>
            <div className="info-row">
                <strong className="info-label">Siedziba:</strong>
                <span className="info-value">{club.address}</span>
            </div>
            <div className="info-row">
                <strong className="info-label">Strona klubu:</strong>
                <span className="info-value"><a href={club.website}>{club.website}</a></span>
            </div>


            <h2 className="clubpage-h2">Aktualne rozgrywki</h2>
            <div className="competitions-container">
                {club.runningCompetitions.map((competition) => (
                    <div className="competition" key={competition.id}>
                        {competition.emblem ? (
                            <img src={competition.emblem} alt={competition.name} className="competition-emblem"/>
                        ) : (
                            <span>{competition.name}</span>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="clubpage-h2">Piłkarze</h2>
            <table className="squad-table">
                <thead>
                <tr>
                    <th>Imię i nazwisko</th>
                    <th>Pozycja</th>
                    <th>Narodowość</th>
                    <th>Data urodzenia</th>
                </tr>
                </thead>
                <tbody>
                {club.squad.map((player) => (
                    <tr key={player.id}>
                        <td>{player.name}</td>
                        <td>{player.position}</td>
                        <td>{player.nationality}</td>
                        <td>{player.dateOfBirth}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClubPage;
