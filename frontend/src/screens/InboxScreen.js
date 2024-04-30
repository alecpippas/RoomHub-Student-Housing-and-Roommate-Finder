import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import housebg from "../static/housebg.png";
import { Container, Row, Col, Card, Image } from "react-bootstrap";

function InboxScreen() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem('token');  // Assuming token storage in local storage

    useEffect(() => {
        if (!userInfo) {
            alert('Please log in.');
            navigate('/login');
        }
    }, [navigate, userInfo]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('/api/get-messages/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(response.data);
                setLoading(false);
            } catch (err) {
                //setError('Failed to fetch messages');
                setLoading(false);
            }
        };
        
        fetchMessages();
    }, [navigate, token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div
          style={{
            backgroundImage: `url(${housebg})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed", 
            backgroundBlendMode: "overlay",
            height: "100vh",
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: "100vw",
            paddingTop: '20vh',
          }}
        >
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px', 
            width: '100%', 
            textAlign: 'center',
            overflowY: 'auto', 
            maxHeight: '60vh', 
          }}>
            <h2>Inbox</h2>
            {messages.length > 0 ? (
                <ul style={{
                  listStyleType: 'none', // Removes bullet points
                  padding: 0, // Removes default padding
                }}>
                    {messages.map((message) => (
                        <li key={message.id} style={{
                          padding: '10px',
                          borderBottom: '1px solid #ccc', // Adds a separator between messages
                          marginTop: '5px', // Adds top margin for spacing
                        }}>
                            <strong>From:</strong> {message.sender.username}<br />
                            <strong>Message:</strong> {message.message}<br />
                            <strong>Date:</strong> {new Date(message.timestamp).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{
                  color: '#888', // Subdued text color for empty message
                  fontStyle: 'italic', // Italicized text for emphasis
                }}>No messages yet.</p>
            )}
            
          </div>
        </div>
    );
}

export default InboxScreen;