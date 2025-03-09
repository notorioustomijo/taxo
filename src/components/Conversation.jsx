// Conversation.jsx
import { useState, useEffect, useRef } from 'react';
import arrowUp from '../assets/arrow-up.svg';
import ReactMarkdown from 'react-markdown';

export default function Conversation({ messages: initialMessages, userId, loading }) {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState(initialMessages || []);
    const lastMessageRef = useRef(null);

    useEffect(() => {
        setMessages(initialMessages || []);
    }, [initialMessages]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with query:', query);
        if (!query || !query.trim()) return;

        const userMessage = {
            text: query,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prevMessages => [
            ...prevMessages,
            userMessage
        ]);
        setQuery('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId,
                },
                body: JSON.stringify({ message: query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.reply) {
                const agentMessage = {
                    text: data.reply,
                    sender: 'agent',
                    timestamp: new Date(),
                };

                setMessages(prevMessages => [
                    ...prevMessages,
                    agentMessage,
                ]);
            } else {
                console.error('Backend error:', data.error || 'Unknown error');
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        text: 'Error: Could not get a response from the server.',
                        sender: 'agent',
                        timestamp: new Date()
                    }
                ]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: 'Something went wrong. Please refresh and try again.',
                    sender: 'agent',
                    timestamp: new Date()
                }
            ])
        } finally {
            setQuery('');
        }
    };

    const buttonClass = query.trim() ? 'active' : 'disabled';

    return (
        <div className="conversation-page">
            <div className="messages">
                <div className="message-list">
                    {messages.map((msg, index) => {
                        const paragraphs = msg.text.split('\n').filter(p => p.trim());
                        return (
                            <div className={`${msg.sender}-msg_container`} key={index}>
                                <div
                                    className={`message ${msg.sender}`}
                                    ref={index === messages.length - 1 ? lastMessageRef : null}
                                >
                                    {paragraphs.map((para, paraIndex) => (
                                        <ReactMarkdown key={paraIndex}>{para}</ReactMarkdown>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {
                        loading && (
                            <div className="agent-msg_container">
                                <div className="message agent loading">
                                    <p>Taxo is thinking...</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="form-container_convo">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="What do you want to know about the tax bill?"
                        id="query"
                        name="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        className={`round-btn ${buttonClass}`}
                        type="submit"
                    >
                        <img src={arrowUp} alt="Submit" />
                    </button>
                </form>
                <div className="pill-btn_section">
                    <p>Taxo can make mistakes. Check important info</p>
                </div>
            </div>
        </div>
    );
}