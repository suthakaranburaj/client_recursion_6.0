import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  styled,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';

const AdvancedChatbot = () => {
  const theme = useTheme();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser does not support speech recognition.");
      return;
    }
    
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
      setMessages((prev) => [...prev, { sender: 'user', text }]);
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
      const textResponse = data.response;
      setResponse(textResponse);
      setMessages((prev) => [...prev, { sender: 'bot', text: textResponse }]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const MessageBubble = styled(Box)(({ theme, sender }) => ({
    maxWidth: '80%',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    wordWrap: 'break-word',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' 
      ? theme.palette.primary.main 
      : theme.palette.mode === 'dark' 
        ? theme.palette.grey[700] 
        : theme.palette.grey[200],
    color: sender === 'user' 
      ? theme.palette.primary.contrastText 
      : theme.palette.text.primary,
    display: 'flex',
    gap: theme.spacing(1),
    boxShadow: theme.shadows[1]
  }));

  return (
    <Box sx={{
      maxWidth: 800,
      margin: '0 auto',
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius * 2,
      boxShadow: theme.shadows[3],
      height: '90vh',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2)
    }}>
      <Typography variant="h4" component="h2" sx={{ 
        textAlign: 'center',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        mb: 1
      }}>
        Advanced Financial Chatbot
      </Typography>

      <Paper sx={{
        flex: 1,
        overflowY: 'auto',
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {messages.map((message, index) => (
          <MessageBubble key={index} sender={message.sender}>
            <Avatar sx={{ 
              width: 24, 
              height: 24,
              bgcolor: message.sender === 'user' 
                ? theme.palette.primary.dark 
                : theme.palette.secondary.main
            }}>
              {message.sender === 'user' ? 'U' : 'B'}
            </Avatar>
            <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
              {message.text}
            </Typography>
          </MessageBubble>
        ))}
        
        {listening && (
          <MessageBubble sender="bot">
            <CircularProgress size={20} />
            <Typography variant="body1">Listening...</Typography>
          </MessageBubble>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <div ref={chatEndRef} />
      </Paper>

      <Button
        variant="contained"
        color={listening ? "secondary" : "primary"}
        onClick={startListening}
        disabled={listening}
        startIcon={listening ? <MicOff /> : <Mic />}
        sx={{
          width: '100%',
          padding: theme.spacing(1.5),
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: theme.shape.borderRadius,
          textTransform: 'none',
          '&:hover': {
            boxShadow: theme.shadows[2]
          }
        }}
      >
        {listening ? 'Listening...' : 'Tap to Speak'}
      </Button>
    </Box>
  );
};

export default AdvancedChatbot;