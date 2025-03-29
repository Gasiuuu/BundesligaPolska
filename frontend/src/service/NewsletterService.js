import axios from 'axios';

class NewsletterService {

    static NODE_URL = "http://localhost:3001"

    static async startNewsletter(formData) {
        await fetch(`${NewsletterService.NODE_URL}/newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: formData.email, firstName: formData.firstName, lastName: formData.lastName })
        });
    }

    static async notifySubscribers(title) {
        try {
            const response = await axios.post(
                `${NewsletterService.NODE_URL}/newsletter/notify`,
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

}

export default NewsletterService;