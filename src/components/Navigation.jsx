import taxoLogo from '../assets/taxo-logo.svg';

export default function Navigation({ onReset, resetLoading, messages }) {
    const isDisabled = resetLoading || messages.length === 0;

    return (
        <nav>
            <button 
                className='logo-btn'
                onClick={onReset}
                disabled={isDisabled}>
                <img src={taxoLogo} alt='Home'/>
            </button>
            <a href="mailto:joshua.tomi1@gmail.com?subject= Feedback about Taxo" className='feedback-btn'>Feedback</a>
        </nav>
    )
}