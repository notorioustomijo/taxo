// PageContent.jsx
import { useState, useEffect } from 'react';
import DefaultPage from "./DefaultPage";
import Conversation from './Conversation';

export default function PageContent({ userId, messages, setMessages, onReset }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            console.log('Waiting for userId to be set...');
            return;
        }

        const clearConversation = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/convo`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    console.log('Conversation history cleared:', data.message);
                    setMessages([]);
                } else {
                    console.error('Failed to clear conversation:', data.error);
                }
            } catch (error) {
                console.error('Error clearing conversation:', error);
            }
        };

        clearConversation();
    }, [userId, setMessages]);

    const handleSendMessage = async (userMessage) => {
        if (!userId) {
            console.error('No userId available for sending message');
            return;
        }

        const userMsg = {
            text: userMessage,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prevMessages => [
            ...prevMessages,
            userMsg
        ]);
        setLoading(true);
        console.log('Loading state set to true:', loading);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': userId,
                },
                body: JSON.stringify({ message: userMessage }),
            });
            const data = await response.json();
            if (data.success && data.reply) {
                const agentMsg = { text: data.reply, sender: 'agent', timestamp: new Date() };
                setMessages(prevMessages => [...prevMessages, agentMsg]);
            } else {
                console.error('Backend error:', data.error || 'Unknown error');
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        text: 'Error: Could not get a response from the server.',
                        sender: 'agent',
                        timestamp: new Date()
                    },
                ]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: 'Error: Failed to connect to the server.',
                    sender: 'agent',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setLoading(false);
            console.log('Loading state set to false:', loading);
        }
    };
    

    if (!userId) {
        return <div>Loading user ID...</div>; // Fallback UI
    }

    return (
        <main>
            <div className="page-content">
                {messages.length === 0 ? (
                    <DefaultPage onSendMessage={handleSendMessage} loading={loading}/>
                ) : (
                    <Conversation messages={messages} userId={userId} loading={loading} onSendMessage={handleSendMessage}/>
                )}
            </div>
        </main>
    );
}