import React, { useEffect, useState } from "react";
import axios from "axios";
import './Table.css'

const apiKey = import.meta.env.VITE_API_KEY;
// console.log("API Key:", apiKey);


const Table = () => {
    const [standings, setStandings] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "/api/v4/competitions/BL1/standings";

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        "X-Auth-Token": apiKey,
                    },
                });

                setStandings(response.data.standings[0].table);
                // setLoading(false);
            } catch (err) {
                console.error("Error fetching standings:", err);
                setError(err);
                // setLoading(false);
            }
        };

        fetchStandings();
    }, []);

    if (error) return <p>Wystąpił błąd podczas ładowania wyników: {error.message}</p>;

    return (
    <div id="standings-container">
        <h1 id="table-header">TABELA</h1>
        <table id="standings-table">
            <thead>
            <tr>
                <th className="s-table-header"></th>
                <th id="s-table-header-team"></th>
                <th className="s-table-header">Rozegrano</th>
                <th className="s-table-header">Wygrane</th>
                <th className="s-table-header">Remisy</th>
                <th className="s-table-header">Przegrane</th>
                <th className="s-table-header">Punkty</th>
            </tr>
            </thead>

            <tbody>
            {standings.map((team, i) => (
                <tr key={team.team.id} id="team-standing">
                    {/*<td>{i}</td>*/}

                    <td
                        className={`standing-row ${
                            i <= 3 ?
                                "cl-row"
                                : i === 4 ?
                                    "el-row"
                                    : i === 5 ?
                                        "ecl-row"
                                        : i === 15 ?
                                            "relegation-row"
                                            : i > 15 && i <= 17 ?
                                                "abstieg-row"
                                                : "default-row"
                        }`}
                    >
                        {team.position}.
                    </td>

                    <td className="team-logo-name">
                        <img
                            src={team.team.crest}
                            alt={`${team.team.name} logo`}
                            className="team-logo"
                        />
                        <span className="team-name">{team.team.name}</span>
                    </td>
                    <td className="standing-row">{team.playedGames}</td>
                    <td className="standing-row">{team.won}</td>
                    <td className="standing-row">{team.draw}</td>
                    <td className="standing-row">{team.lost}</td>
                    <td className="standing-row">{team.points}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <div id="legend">
            <div className="cl-row2">Liga Mistrzów</div>
            <div className="el-row2">Liga Europy</div>
            <div className="ecl-row2">Liga Konferencji Europy</div>
            <div className="relegation-row2">Baraże</div>
            <div className="abstieg-row2">Spadek (2. Bundesliga)</div>
        </div>

    </div>

    );
};

export {Table};
