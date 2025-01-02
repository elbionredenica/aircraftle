import React from 'react';
import { AircraftData } from '../types/aircraft';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    aircraft?: AircraftData;
}
  
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, aircraft }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="modal">
                <div className="modal-content">
                    <h2>{title}</h2>
                    {/* Render children if provided */}
                    {children} 
                    {/* Conditionally render aircraft info */}
                    {aircraft && (
                        <div className="modal-aircraft-info">
                            <img
                                src={aircraft.imageUrl}
                                alt={`Image of ${aircraft.manufacturer} ${aircraft.model}`}
                            />
                            <p>
                                The aircraft was a {aircraft.manufacturer} {aircraft.model} ({aircraft.icao}).
                            </p>
                            <p>
                                <a href={aircraft.wikiUrl} target="_blank" rel="noopener noreferrer" className='link-button'>
                                    Learn more on Wikipedia
                                </a>
                            </p>
                        </div>
                    )}
                    <div className="modal-buttons">
                        <button onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
};
  
export default Modal;