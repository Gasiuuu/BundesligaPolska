import React, { useEffect, useState } from "react";
import NewsService from "../../service/NewsService.js";
import "./NewsManagement.css"
import { TiDelete } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import {Link} from "react-router-dom";

function NewsManagement() {

    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchNews()
    }, []);

    const fetchNews = async () => {
        try {
            const newsList = await NewsService.getAllNews();
            console.log(newsList);
            setNews(newsList.newsEntityList);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const handleDelete = async (newsId) => {
        try{
            await NewsService.deleteNews(newsId)
            alert("Pomyślnie usunięto news")
            window.location.reload();
        } catch (error) {
            console.error('Błąd usuwania artykułu: ', error);
            alert("Nie udało sie usunąć newsa")
        }

    }

    return(
        <div className="panel-container">
            {news.map((article) => (
                <div className="news-panel-option" key={article.id}>
                    <div className="news-object">
                        <p><span>Id: </span>{article.id}</p>
                        <p><span>Tytuł: </span>{article.title}</p>
                        <p><span>Autor: </span>{article.author}</p>
                    </div>

                    <div className="news-options">
                        <Link to={`/edytuj-artykul/${article.id}`}>
                            <button className="edit-btn">
                                <MdEdit/> Edytuj
                            </button>
                        </Link>
                        <button className="delete-btn" onClick={() => handleDelete(article.id)}>
                            <TiDelete /> Usuń
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NewsManagement;