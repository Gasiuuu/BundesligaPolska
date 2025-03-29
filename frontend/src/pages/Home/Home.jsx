import React, { useState, useEffect } from 'react';
import UserService from "../../service/UserService.js";
import axios from 'axios';
import './Home.css';
import NewsService from "../../service/NewsService.js";
import {Link} from "react-router-dom";
const apiKey = import.meta.env.VITE_API_KEY;


function Home() {
    const [profileInfo, setProfileInfo] = useState({});
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const [currentMatchday, setCurrentMatchday] = useState(null);
    const [news, setNews] = useState([]);
    const [clubs, setClubs] = useState([]);
    const teamsToDisplay = ["Borussia Dortmund", "FC Bayern München", "Bayer 04 Leverkusen", "VfL Wolfsburg", "RB Leipzig"];


    useEffect(() => {
        fetchProfileInfo();
        fetchLastMatchdayResults();
        fetchNews();
        fetchClubs();
    }, []);

    const fetchNews = async () => {
        try {
            const newsList = await NewsService.getAllNews();
            const sortedNews = newsList.newsEntityList.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
            setNews(sortedNews);
            console.log(sortedNews);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const fetchProfileInfo = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.userEntity);
        } catch (error) {
            console.error('Error fetching profile information: ', error);
        }
    };


    const fetchLastMatchdayResults = async () => {
        try {
            const response = await axios.get(`/api/v4/competitions/BL1`, {
                headers: {
                    'X-Auth-Token': apiKey,
                },
            });

            console.log(response.data);

            const currentMatchdayValue = parseInt(response.data.currentSeason.currentMatchday, 10);
            setCurrentMatchday(currentMatchdayValue);

            if (currentMatchdayValue <= 1) {
                setError('Brak wyników dla poprzedniej kolejki, ponieważ to jest początek sezonu.');
                return;
            }

            const response2 = await axios.get(`/api/v4/competitions/BL1/matches?matchday=${currentMatchdayValue-1}`, {
                headers: {
                    'X-Auth-Token': apiKey,
                },
            });

            const allMatches = response2.data.matches;
            console.log(allMatches);

            setMatches(allMatches);
        } catch (error) {
            console.error('Error fetching match data:', error);
            setError('Nie udało się pobrać wyników.');
        }
    };

    const fetchClubs = async () => {
        try {
            const response = await axios.get('/api/v4/competitions/2002/teams', {
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

    return (
        <div className="home-container">
            <div>
                <h1 className="results-header">Wyniki {currentMatchday ? `${currentMatchday}. kolejki` : 'poprzedniej kolejki'}</h1>
                {error && <p>{error}</p>}
                <ul style={{display: 'flex', justifyContent: 'center'}}>
                    {matches.map(match => (
                        <li className="matchday-results" key={match.id}>
                            <div>
                                <img src={match.homeTeam.crest} alt={`${match.homeTeam.name} logo`}
                                     className="team-logo"/>
                                <p className="name-short">{match.homeTeam.tla}</p>
                            </div>

                            <p className="results"> {match.score.fullTime.home} - {match.score.fullTime.away}</p>
                            <div>
                                <img src={match.awayTeam.crest} alt={`${match.awayTeam.name} logo`}
                                     className="team-logo"/>
                                <p className="name-short">{match.awayTeam.tla}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {UserService.isAuthenticated() && (
                <h1 className="hello-title">Witaj, {profileInfo.firstName}!</h1>
            )}

            {news.length > 0 && (
                <Link to={`/wiadomosci/${news[0].id}`}>
                    <div className="latest-news">
                        <div className="news-item-with-overlay">
                            <img src={news[0].imageUrl} alt="News thumbnail" className="news-thumbnail"/>
                            <div className="news-overlay">
                                <h3 className="news-title">{news[0].title}</h3>
                                <p className="news-description">{news[0].content}</p>
                            </div>
                        </div>
                    </div>
                </Link>

            )}

            <Link to="/kluby">
                <h2 className="clubs-link-hp">Kluby &gt;</h2>
            </Link>
            <div className="hp-clubs-container">
            {clubs.filter(club => teamsToDisplay.includes(club.name))
                    .map(club => (
                        <Link to={`/kluby/${club.id}`} key={club.id}>
                            <div key={club.id} className="team-card" id={`club-${club.id}`}>
                                <img src={club.crest} alt={`${club.name} logo`} className="team-logo-homepage"/>
                            </div>
                        </Link>

                    ))}
            </div>

            <Link to="/forum">
                <h2 className="forum-link-hp">Przejdź do forum &gt;</h2>
            </Link>

            <h2 className="news-hp">Inne artykuły</h2>

            {news.length > 1 && (
                <div className="news-container">
                    {news
                        .filter((_, index) => index >= 1 && index <= 6)
                        .map(singleNews => (
                            <Link to={`/wiadomosci/${singleNews.id}`} key={singleNews.id}>
                                <div className="latest-news2">
                                    <div className="news-item-with-overlay">
                                        <img
                                            src={singleNews.imageUrl}
                                            alt="News thumbnail"
                                            className="news-thumbnail2"
                                        />
                                        <div className="news-overlay">
                                            <h3 className="news-title2">{singleNews.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            )}
        </div>
    );
}

export {Home};