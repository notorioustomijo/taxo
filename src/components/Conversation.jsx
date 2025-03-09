// Conversation.jsx
import { useState, useEffect, useRef } from 'react';
import arrowUp from '../assets/arrow-up.svg';
import ReactMarkdown from 'react-markdown';

export default function Conversation({ messages: initialMessages, userId, loading, onSendMessage }) {
    console.log('Loading Prop in Converation:', loading);
    const [query, setQuery] = useState('');
    const lastMessageRef = useRef(null);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [initialMessages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query || !query.trim()) return;

        onSendMessage(query);
        setQuery('');
    };

    const buttonClass = query.trim() ? 'active' : 'disabled';

    return (
        <div className="conversation-page">
            <div className="messages">
                <div className="message-list">
                    {initialMessages.map((msg, index) => {
                        const paragraphs = msg.text.split('\n').filter(p => p.trim());
                        return (
                            <div className={`${msg.sender}-msg_container`} key={index}>
                                <div
                                    className={`message ${msg.sender}`}
                                    ref={index === initialMessages.length - 1 ? lastMessageRef : null}
                                >
                                    {paragraphs.map((para, paraIndex) => (
                                        <ReactMarkdown key={paraIndex}>{para}</ReactMarkdown>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {loading && (
                        <div className="agent-msg_container">
                            <div className="message agent loading">
                                <p>Taxo is thinking...</p>
                            </div>
                        </div>
                    )}
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
                        disabled={loading} // Disable button while loading
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