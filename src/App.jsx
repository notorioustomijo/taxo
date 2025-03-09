// App.jsx
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navigation from "./components/Navigation";
import PageContent from "./components/PageContent";
import Modal from './components/Modal';

function App() {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [resetLoading, setResetLoading] = useState(false);

    useEffect(() => {
        let storedUserId = localStorage.getItem('tempUserId');
        if (!storedUserId) {
            storedUserId = uuidv4();
            localStorage.setItem('tempUserId', storedUserId);
        }
        setUserId(storedUserId);
        setIsLoading(false);

        const handleBeforeUnload = () => {
            localStorage.removeItem('tempUserId');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const resetMessages = useCallback(async () => {
        if (!userId) return false;
        setResetLoading(true);
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
                return true;
            } else {
                console.error('Failed to clear conversation:', data.error);
                return false;
            }
        } catch (err) {
            console.error('Error resetting conversation:', err);
            return false;
        } finally {
          setResetLoading(false);
        }
    }, [userId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page">
            <Navigation onReset={resetMessages} resetLoading={resetLoading} messages={messages}/>
            <PageContent userId={userId} messages={messages} setMessages={setMessages} onReset={resetMessages}/>
            <Modal isOpen={resetLoading} />
        </div>
    );
}

export default App;