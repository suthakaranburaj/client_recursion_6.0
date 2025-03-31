import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  styled,
  CircularProgress,
  Alert,
  Avatar,
  TextField,
  IconButton
} from "@mui/material";
import { Mic, MicOff, Send } from "@mui/icons-material";

const AdvancedChatbot = () => {
  const theme = useTheme();
  const [listening, setListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
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
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      handleMessageSubmit(text);
      setListening(false);
    };

    recognition.onerror = (event) => {
      setError("Speech recognition error: " + event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const handleMessageSubmit = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/financial_query/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    handleMessageSubmit(inputText);
    setInputText("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const MessageBubble = styled(Paper)(({ theme, sender }) => ({
    maxWidth: "75%",
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius * 2,
    marginBottom: theme.spacing(2),
    alignSelf: sender === "user" ? "flex-end" : "flex-start",
    backgroundColor:
      sender === "user" ? theme.palette.primary.main : theme.palette.background.paper,
    color: sender === "user" ? theme.palette.primary.contrastText : theme.palette.text.primary,
    display: "flex",
    gap: theme.spacing(1.5),
    alignItems: "center",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)"
    }
  }));

  return (
    <Box
      sx={{
        maxWidth: "md",
        width: "40vw",
        margin: "0 auto",
        padding: theme.spacing(3),
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        backgroundColor: theme.palette.background.default
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: theme.palette.primary.main,
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
        }}
      >
        Financial Assistant
      </Typography>

      <Paper
        elevation={3}
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {messages.map((message, index) => (
          <MessageBubble key={index} sender={message.sender} elevation={2}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor:
                  message.sender === "user"
                    ? theme.palette.primary.dark
                    : theme.palette.secondary.main
              }}
            >
              {message.sender === "user" ? "U" : "AI"}
            </Avatar>
            <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
              {message.text}
            </Typography>
          </MessageBubble>
        ))}

        {listening && (
          <MessageBubble sender="bot">
            <CircularProgress size={24} />
            <Typography variant="body1">Listening...</Typography>
          </MessageBubble>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, alignSelf: "center" }}>
            {error}
          </Alert>
        )}

        <div ref={chatEndRef} />
      </Paper>

      <Box
        component="form"
        onSubmit={handleTextSubmit}
        sx={{
          display: "flex",
          gap: theme.spacing(1),
          "& > :not(style)": { borderRadius: theme.shape.borderRadius * 2 }
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => recognitionRef.current?.start()}
                disabled={listening}
                sx={{ color: theme.palette.primary.main }}
              >
                {listening ? <MicOff /> : <Mic />}
              </IconButton>
            )
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!inputText.trim()}
          sx={{ px: 4, py: 1.5 }}
        >
          <Send sx={{ mr: 1 }} />
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default AdvancedChatbot;
