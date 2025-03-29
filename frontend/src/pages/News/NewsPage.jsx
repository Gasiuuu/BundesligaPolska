import React, { useEffect, useState } from 'react';
import NewsService from '../../service/NewsService';
import './NewsPage.css';
import {Link} from "react-router-dom";

function NewsPage() {
    const [news, setNews] = useState([]);

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

    useEffect(() => {
        fetchNews()
    }, []);

    return (
        <div className="news-page">
            <div className="news-list">
                {news.map((item, index) => (
                    <div key={index} className="news-item">

                        <div className="news-content-left">
                            <img src={item.imageUrl} alt="obraz" className="news-image"/>
                        </div>

                        <div className="news-content-right">
                            <p className="publish-date">Data publikacji: {new Date(item.publishedDate).toLocaleDateString()}</p>
                            <h2 className="title">{item.title}</h2>
                            <p className="content">
                                {/*{item.content}*/}
                                {item.content.length > 150 ? `${item.content.slice(0, 150)}...` : item.content}
                            </p>
                            <Link to={`/wiadomosci/${item.id}`}>
                                <button className="article-navigate">Czytaj dalej &gt;</button>
                            </Link>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewsPage;