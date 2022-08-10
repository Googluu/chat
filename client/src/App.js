import { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000')

function App() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message)
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([newMessage, ...messages]);
    setMessage('')
  }

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message, ...messages])
    }
    socket.on('message', receiveMessage);

    return () => {
      socket.off('message', receiveMessage);
    }
  }, [messages]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text"
          onChange={e => setMessage(e.target.value)}
          value={message} />
        <button>send</button>
      </form>

    {messages.map((message, index) => (
      <div key={index}>
        <p>{message.from}:{message.body}</p>
      </div>
    ))}
    </div>
  );
}

export default App;
