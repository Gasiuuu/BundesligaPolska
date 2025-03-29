import React, {useEffect, useState} from 'react'
import './Article.css'
import { useParams } from "react-router-dom";
import NewsService from "../../service/NewsService.js";

function Article() {

    const {newsId} = useParams();
    const [article, setArticle] = useState(null);


    const fetchArticle = async () => {
        try {
            console.log('Pobieranie artykułu o ID:', newsId);
            const articleData = await NewsService.getNewsById(newsId);
            console.log('Dane artykułu:', articleData);
            setArticle(articleData);
        } catch (error) {
            console.error('Błąd pobierania artykułu:', error);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [])

    if (!article) {
        return <div>Ładowanie artykułu...</div>;
    }

    return (
        <div className="article-page">
            <img src={article.newsEntity.imageUrl} alt="obraz" className="article-image"/>
            <p className="publish-date"><span className="publish-date-2">Autor: </span>{article.newsEntity.author}</p>
            <p className="publish-date">
                <span
                    className="publish-date-2">Data publikacji: </span>{new Date(article.newsEntity.publishedDate).toLocaleDateString()}
            </p>
            <h1 className="title">{article.newsEntity.title}</h1>
            <p className="content">{article.newsEntity.content}</p>
        </div>
    )
}

export default Article;