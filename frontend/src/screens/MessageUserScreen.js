import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function MessageUserScreen() {
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleMessageSubmit = async () => {
    if (!message.trim()) return; // Check if message is not just empty spaces

    try {
      console.log("yo");
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios.post(
        "api/send-message/",
        {
          receiver: userId,
          message: message,
        },
        config
      );
      navigate("/inbox"); // Redirect after sending
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message, please try again.");
    }
  };

  return (
    <div>
      <h2>Send Message</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
      ></textarea>
      <button onClick={handleMessageSubmit}>Send Message</button>
    </div>
  );
}

export default MessageUserScreen;
