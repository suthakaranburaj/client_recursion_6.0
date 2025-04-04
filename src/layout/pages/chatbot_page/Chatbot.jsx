import * as React from "react";
import { useState, useEffect, useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight, materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@mui/material/styles";

const MarkdownRenderer = ({ children }) => {
  const theme = useTheme();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={theme.palette.mode === "dark" ? materialDark : materialLight}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return <table className="markdown-table">{children}</table>;
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

function Chatbot({ user = { subscription: true } }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onerror = (event) => setError("Speech recognition error: " + event.error);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      submitUserMessage(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const submitUserMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: messageText, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/finance-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: messageText })
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.bot_response || data.error,
          isBot: true
        }
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          text: "Error communicating with the assistant",
          isBot: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    submitUserMessage(input.trim());
    setInput("");
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setError("");
      recognitionRef.current.start();
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 128px)",
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
        backgroundColor: theme.palette.background.default
      }}
    >
      <List
        sx={{
          flexGrow: 1,
          overflow: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            sx={{
              alignSelf: msg.isBot ? "flex-start" : "flex-end",
              maxWidth: "80%",
              width: "fit-content"
            }}
          >
            {msg.isBot && (
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "primary.main" }}>🤖</Avatar>
              </ListItemAvatar>
            )}
            <ListItemText
              primary={msg.isBot ? <MarkdownRenderer>{msg.text}</MarkdownRenderer> : msg.text}
              sx={{
                bgcolor: msg.isBot ? theme.palette.action.selected : theme.palette.primary.main,
                color: msg.isBot ? theme.palette.text.primary : theme.palette.primary.contrastText,
                p: 2,
                borderRadius: 2,
                "& pre": {
                  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
                  padding: "1rem",
                  borderRadius: "4px",
                  overflowX: "auto"
                },
                "& code": {
                  fontFamily: "monospace",
                  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
                  padding: "0.2em 0.4em",
                  borderRadius: "3px"
                },
                "& table": {
                  borderCollapse: "collapse",
                  width: "100%",
                  margin: "1rem 0"
                },
                "& th, & td": {
                  border: `1px solid ${theme.palette.divider}`,
                  padding: "8px",
                  textAlign: "left"
                },
                "& th": {
                  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5"
                }
              }}
            />
            {!msg.isBot && (
              <ListItemAvatar sx={{ minWidth: "auto", ml: 2 }}>
                <Avatar sx={{ bgcolor: "secondary.main" }}>👤</Avatar>
              </ListItemAvatar>
            )}
          </ListItem>
        ))}

        {isLoading && (
          <ListItem sx={{ alignSelf: "flex-start", maxWidth: "80%" }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "primary.main" }}>🤖</Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                bgcolor: theme.palette.action.selected,
                p: 2,
                borderRadius: 2,
                width: "fit-content"
              }}
              primary={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </Box>
              }
            />
          </ListItem>
        )}

        {listening && (
          <ListItem sx={{ alignSelf: "flex-start", maxWidth: "80%" }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "primary.main" }}>🤖</Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                bgcolor: theme.palette.action.selected,
                p: 2,
                borderRadius: 2,
                width: "fit-content"
              }}
              primary="Listening..."
            />
          </ListItem>
        )}
      </List>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask financial questions..."
          disabled={isLoading}
        />

        {user.subscription && (
          <IconButton
            onClick={startListening}
            disabled={isLoading || listening}
            color={listening ? "secondary" : "default"}
          >
            {listening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        )}

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          Send
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Error: {error}
        </Typography>
      )}

      <style>{`
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          background: ${theme.palette.text.secondary};
          border-radius: 50%;
          animation: typing 1.2s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </Box>
  );
}

export default Chatbot;