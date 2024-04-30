import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InboxScreen() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/receive-messages/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMessages(data.results);  // Assuming paginated response
                setLoading(false);
            } catch (err) {
                setError('Could not fetch messages');
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Inbox</h2>
            {messages.length > 0 ? (
                <ul>
                    {messages.map((message) => (
                        <li key={message.id}>
                            <strong>From:</strong> {message.sender.username}<br/>
                            <strong>Message:</strong> {message.message}<br/>
                            <strong>Date:</strong> {new Date(message.timestamp).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No messages yet.</p>
            )}
        </div>
    );
}

export default InboxScreen;