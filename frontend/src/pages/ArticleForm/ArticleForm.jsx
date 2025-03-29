import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../service/UserService';
import NewsService from '../../service/NewsService';
import './ArticleForm.css';
import NewsletterService from "../../service/NewsletterService.js";

function ArticleForm() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [file, setFile] = useState(null);

    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        console.log(UserService.isAdmin())
    }, []);

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

        await NewsService.addNews(formData, token);

        console.log(formData);
        // const subscribersResponse = await fetch('http://localhost:5000/subscribers');
        // const subscribers = await subscribersResponse.json();

        await NewsletterService.notifySubscribers( { title });
        alert('Pomyślnie dodano artykuł i powiadomiono subskrybentów!');
        // navigate('/strona-glowna');
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

export default ArticleForm;
