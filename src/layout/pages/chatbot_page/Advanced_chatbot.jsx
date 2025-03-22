import React, { useState, useEffect, useRef } from 'react';

const AdvancedChatbot = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  
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
      setResponse(data.response);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Advanced Financial Chatbot</h2>
      <p>Tap the speaker button and ask your financial question.</p>
      <button 
        onClick={startListening} 
        disabled={listening}
        style={{
          fontSize: '1.5rem',
          padding: '10px 20px',
          cursor: listening ? 'not-allowed' : 'pointer'
        }}
      >
        {listening ? 'Listening...' : '🎤 Start Recording'}
      </button>
      {transcript && (
        <div style={{ marginTop: '20px' }}>
          <h3>Your Query:</h3>
          <p>{transcript}</p>
        </div>
      )}
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedChatbot;
