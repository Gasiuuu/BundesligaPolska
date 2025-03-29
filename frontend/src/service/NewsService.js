import axios from 'axios'

class NewsService {

    static BASE_URL = "http://localhost:8080"
    static NODE_URL = "http://localhost:3001"

    static async addNews(formData, token) {
        try {
            const response = await axios.post(
                `${NewsService.BASE_URL}/admin/add-news`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log('Artykuł dodany:', response.data);

        } catch (err) {
            console.error('Błąd:', err.response?.data || err.message);
        }
    }

    static async notifySubscribers(title) {
        try {
            const response = await axios.post(
                `${NewsService.NODE_URL}/newsletter/notify`,
                title,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log('Powiadomienie wysłane: ', response.data);
        } catch (err) {
            console.error('Błąd podczas wysyłania powiadomień: ', err.response?.data || err.message);
        }
    }



    static async getAllNews() {
        try {
            const response = await axios.get(`${NewsService.BASE_URL}/public/news`);
            return response.data;
        } catch (err) {
            console.error('Błąd podczas pobierania wiadomości:', err);
            return [];
        }
    }

    static async getNewsById(newsId) {
        try {
            console.log(`Pobieranie z URL: ${NewsService.BASE_URL}/public/news/${newsId}`);
            const response = await axios.get(`${NewsService.BASE_URL}/public/news/${newsId}`);
            console.log('Odpowiedź API:', response.data);
            return response.data;
        } catch (err) {
            console.error('Błąd podczas pobierania wiadomości: ', err);
            throw err;
        }
    }

    static async editNews(newsId, formData, token) {
        try {
            const response = await axios.put(
                `${NewsService.BASE_URL}/admin/news/${newsId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Artykuł został zaaktualizowany:', response.data);

        } catch (err) {
            console.error("Błąd podczas edytownaia artykułu: ", err)
        }
    }

    static async deleteNews(newsId) {
        try {
            await axios.delete(`${NewsService.BASE_URL}/admin/news/${newsId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                }
            })

        } catch (err) {
            console.error('Błąd podczas usuwania wiadomości: ', err);
            throw err;
        }
    }

}

export default NewsService;