import naijaFlag from '../assets/naija-flag.svg';
import arrowUp from '../assets/arrow-up.svg';
import { useState } from 'react';

export default function DefaultPage({ onSendMessage, loading }) {

    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSendMessage(query);
            setQuery('');
        }
    };

    const buttonClass = query.trim() ? 'active' : 'disabled';

    const handleTellMeAboutTaxBill = () => {
        onSendMessage('Tell me about the Nigerian Tax Bill 2024');
    };

    const handleCalculateTax = () => {
        onSendMessage('Help me calculate my tax based on the Nigerian Tax Bill 2024');
    };

    const handleTaxesInNigeria = () => {
        onSendMessage('What taxes are applicable in Nigeria under the Tax Bill 2024?')
    };

    return (
        <div className='default-page'>
            <h1>Ask me about the Nigerian Tax Bill 2024</h1>
            <div className="form-container">
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
                        type='submit'
                        disabled={loading}>
                        <img src={arrowUp} alt='Submit'/>
                    </button>
                </form>
                <div className='pill-btn_section'>
                    <button 
                        className='pill-btn'
                        onClick={handleTellMeAboutTaxBill}
                        disabled={loading}
                        >ℹ️ Tell me about the Tax Bill 2024</button>
                    <button 
                        className='pill-btn'
                        onClick={handleCalculateTax}
                        disabled={loading}
                        >🧮 Help me calculate my Tax</button>
                    <button 
                        className='pill-btn'
                        onClick={handleTaxesInNigeria}
                        disabled={loading}
                        >🇳🇬 Taxes applicable in Nigeria</button>
                </div>
            </div>
        </div>
    )
}