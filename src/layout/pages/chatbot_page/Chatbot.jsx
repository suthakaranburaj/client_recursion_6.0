// src/components/ChatInterface.jsx
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={materialLight}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
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
          return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
        }
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

function Chatbot() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/finance-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      // Add bot response
      setMessages(prev => [...prev, { 
        text: data.bot_response || data.error, 
        isBot: true 
      }]);
      
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { 
        text: 'Error communicating with the assistant', 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 128px)',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      gap: 2
    }}>
      <List sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((msg, index) => (
          <ListItem 
            key={index}
            sx={{
              alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
              maxWidth: '80%',
              width: 'fit-content'
            }}
          >
            {msg.isBot && (
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>🤖</Avatar>
              </ListItemAvatar>
            )}
            <ListItemText
              primary={
                msg.isBot ? (
                  <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                ) : (
                  msg.text
                )
              }
              sx={{
                bgcolor: msg.isBot ? 'action.selected' : 'primary.main',
                color: msg.isBot ? 'text.primary' : 'primary.contrastText',
                p: 2,
                borderRadius: 2,
                '& pre': {
                  backgroundColor: '#f5f5f5 !important',
                  padding: '1rem !important',
                  borderRadius: '4px !important',
                  overflowX: 'auto !important'
                },
                '& code': {
                  fontFamily: 'monospace !important',
                  backgroundColor: '#f5f5f5 !important',
                  padding: '0.2em 0.4em !important',
                  borderRadius: '3px !important'
                },
                '& table': {
                  borderCollapse: 'collapse !important',
                  width: '100% !important',
                  margin: '1rem 0 !important'
                },
                '& th, & td': {
                  border: '1px solid #ddd !important',
                  padding: '8px !important',
                  textAlign: 'left !important'
                },
                '& th': {
                  backgroundColor: '#f5f5f5 !important'
                }
              }}
            />
            {!msg.isBot && (
              <ListItemAvatar sx={{ minWidth: 'auto', ml: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>👤</Avatar>
              </ListItemAvatar>
            )}
          </ListItem>
        ))}
        {isLoading && (
          <ListItem sx={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>🤖</Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                bgcolor: 'action.selected',
                p: 2,
                borderRadius: 2,
                width: 'fit-content'
              }}
              primary={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </Box>
              }
            />
          </ListItem>
        )}
      </List>

      <Box sx={{ 
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        background: 'white'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask financial questions..."
          disabled={isLoading}
        />
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
          background: #666;
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
