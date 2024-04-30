import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import housebg from "../static/housebg.png";
import { Container, Row, Col, Card, Image } from "react-bootstrap";

function MessageUserScreen() {
  const { userId } = useParams();  // Receiver's ID obtained from the URL
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleMessageSubmit = async () => {
    if (!message.trim()) return; // Check if message is not just empty spaces

    try {
      const token = localStorage.getItem('token');
      
      await axios.post('api/send-message/', {
        receiver: userId,
        message: message
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Message sent successfully!');
      navigate('/inbox'); // Redirect after sending
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message, please try again.');
    }
  };

  useEffect(() => {
    if (!userInfo) {
        alert('Please log in.');
        navigate('/login');
    }
  }, [navigate, userInfo]);


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
    }}>
      <h2>Send Message</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
        style={{ 
          width: '100%', 
          height: '100px', 
          padding: '10px', 
          borderRadius: '5px', 
          border: '1px solid #ccc', 
        }}
      ></textarea>
      <button 
        onClick={handleMessageSubmit}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '16px', 
          borderRadius: '5px', 
          backgroundColor: '#007BFF', 
          color: 'white', 
          border: 'none', 
          cursor: 'pointer', 
        }}
      >
        Send Message
      </button>
    </div>
  </div>
);
}


export default MessageUserScreen;