export default function Modal({ isOpen }) {
    if (!isOpen) return null;

    return (
        <div className='modal-overlay'>
            <div className="modal-content">
                <div className='spinner'></div>
                <h2>Resetting Conversation</h2>
                <p>This will only take a moment...</p>
            </div>
        </div>
    )
}