import React, { useState, useEffect, useRef } from 'react';

const AdvancedChatbot = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]); // Stores chat messages
  const chatEndRef = useRef(null); // For auto-scrolling to the latest message

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser does not support speech recognition.");
      return;
    }
    
    // Create a new SpeechRecognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript;
      setTranscript(text);
      setListening(false);
      // Add user message to chat
      setMessages((prev) => [...prev, { sender: 'user', text }]);
      // Send prompt to backend when speech is captured
      sendPrompt(text);
    };

    recognition.onerror = (event) => {
      setError("Speech recognition error: " + event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Function to start listening to the user's speech
  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not available.");
      return;
    }
    setTranscript('');
    setResponse('');
    setError('');
    recognitionRef.current.start();
  };

  // Function to send the recognized text as a prompt to the Django backend
  const sendPrompt = async (promptText) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/financial_query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptText })
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }
      const data = await res.json();
      // Extract the text response from the JSON
      
      const textResponse = data.response.json; // Assuming the JSON has a "response" field
      setResponse(textResponse);
      // Add bot response to chat
      setMessages((prev) => [...prev, { sender: 'bot', text: textResponse }]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Advanced Financial Chatbot</h2>
      <div style={styles.chatWindow}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(message.sender === 'user' ? styles.userMessage : styles.botMessage),
            }}
          >
            <p style={styles.messageText}>{message.text}</p>
          </div>
        ))}
        {listening && (
          <div style={styles.message}>
            <p style={styles.messageText}>Listening...</p>
          </div>
        )}
        {error && (
          <div style={styles.errorMessage}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}
        <div ref={chatEndRef} /> {/* Invisible element for auto-scrolling */}
      </div>
      <button
        onClick={startListening}
        disabled={listening}
        style={listening ? styles.buttonListening : styles.button}
      >
        {listening ? '🎤 Listening...' : '🎤 Tap to Speak'}
      </button>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '800px', // Wider container
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    height: '90vh', // Larger container
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '10px',
  },
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px', // More padding
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '20px', // More margin
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  message: {
    maxWidth: '80%', // Wider messages
    padding: '15px', // More padding
    borderRadius: '12px',
    marginBottom: '15px', // More margin
    wordWrap: 'break-word',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: '#fff',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e9ecef',
    color: '#333',
    alignSelf: 'flex-start',
  },
  messageText: {
    margin: 0,
    fontSize: '16px', // Larger font size
    lineHeight: '1.5',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    padding: '15px', // More padding
    borderRadius: '8px',
    marginBottom: '15px', // More margin
  },
  errorText: {
    margin: 0,
    fontSize: '16px', // Larger font size
  },
  button: {
    width: '100%',
    padding: '15px 20px', // More padding
    fontSize: '18px', // Larger font size
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonListening: {
    width: '100%',
    padding: '15px 20px', // More padding
    fontSize: '18px', // Larger font size
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
  },
};

export default AdvancedChatbot;