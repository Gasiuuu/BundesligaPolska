import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom";
import UserService from '../../service/UserService';
import NewsService from '../../service/NewsService';
import '../ArticleForm/ArticleForm.css';

function EditNews() {

    const { newsId } = useParams();
    const [news, setNews] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [file, setFile] = useState(null);

    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log(UserService.isAdmin())
        fetchNewsById(newsId)

    }, [newsId]);

    const fetchNewsById  = async (newsId) => {
        const response = await NewsService.getNewsById(newsId);
        console.log("odpowiedz w fetchNewsById: ", response.newsEntity)

        const { title, content, author, imageUrl } = response.newsEntity;
        setTitle(title);
        setContent(content);
        setAuthor(author);
        setFile(imageUrl);

        setNews(response.newsEntity);
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        if (file) {
            formData.append('file', file);
        }

        const token = sessionStorage.getItem('token');
        console.log(token);

        await NewsService.editNews(newsId, formData, token);

        console.log(formData);
        // const subscribersResponse = await fetch('http://localhost:5000/subscribers');
        // const subscribers = await subscribersResponse.json();

        await NewsService.notifySubscribers( { title });
        alert('Pomyślnie dodano artykuł i powiadomiono subskrybentów!');
        navigate('/zarzadzanie-artykulami');
    };

    return (
        <div className="articleForm-container">
            <h1>Dodaj artykuł</h1>
            <form onSubmit={handleSubmit} className="article-form">
                <div className="article-form-group">
                    <input
                        type="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Tytuł"
                        required
                    />
                </div>
                <div className="article-form-group">
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Treść artykułu"
                className="article-form-content"
                required
                rows="10"
            />
                </div>

                <div className="article-form-group">
                    <input
                        type="author"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Autor"
                        required
                    />
                </div>

                <div className="article-form-group">
                    <input
                        type="file"
                        id="file"
                        accept="file/*"
                        onChange={handleFileChange}
                    />
                </div>

                {error && <p className="addProduct-error-message">{error}</p>}
                <button type="submit" className="article-submit-btn">Zatwierdź</button>
            </form>
        </div>
    );
}

export default EditNews;
