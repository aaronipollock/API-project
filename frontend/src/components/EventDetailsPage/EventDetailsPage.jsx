import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './EventDetailsPage.css';
import { csrfFetch } from '../../store/csrf';
import { useSelector } from 'react-redux';
import { FaClock, FaDollarSign, FaMapPin } from 'react-icons/fa';

function EventDetailsPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`/api/events/${eventId}`);
                console.log('Response status:', response.status);
                if (response.ok) {
                    const eventData = await response.json();
                    console.log('Event Data:', eventData);
                    console.log('Current User:', currentUser);
                    console.log('Group:', eventData.Group);
                    console.log('Is Host?', currentUser?.id === eventData.Group?.organizerId);
                    setEvent(eventData);
                    setGroup(eventData.Group);
                } else {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    throw new Error(`Failed to fetch event details: ${errorData.message}`);
                }
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.toString());
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [eventId, currentUser]);

    const handleDeleteEvent = async () => {
        const response = await csrfFetch(`/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            navigate('/events');
        } else {
            alert('Failed to delete event');
        }
    };

    const handleUpdateEvent = () => {
        navigate(`/events/${eventId}/edit`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const isHost = Boolean(currentUser && group && currentUser.id === group.organizerId);

    return (
        <div className="event-details-page">
            <nav className="breadcrumb">
                <Link to="/events">&lt; Events</Link>
            </nav>
            <div className="event-header">
                <h1>{event.name}</h1>
                <p>Hosted by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>
            </div>
            <div className="event-content">
                <img
                    src={event.previewImage || 'https://placehold.co/600x400?text=No+Image'}
                    className="event-image"
                    alt={event.name}
                />
                <div className="event-info-box">
                    <div className="event-time">
                        <FaClock className="icon" />
                        <div className="time-details">
                            <div className="time-section">
                                <span className="time-label">START</span>
                                <span className="time-value">
                                    {new Date(event.startDate).toLocaleDateString()} · {new Date(event.startDate).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="time-section">
                                <span className="time-label">END</span>
                                <span className="time-value">
                                    {new Date(event.endDate).toLocaleDateString()} · {new Date(event.endDate).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="event-price">
                        <FaDollarSign className="icon" />
                        <span>{event.price > 0 ? `$${event.price}` : 'FREE'}</span>
                    </div>
                    <div className="event-location">
                        <FaMapPin className="icon" />
                        <span>{event.type === 'In person' ? 'In person' : 'Online'}</span>
                    </div>
                </div>
            </div>
            <div className="event-description-section">
                <h2>Description</h2>
                <p>{event.description}</p>
            </div>
            <div className="group-info-box">
                <h2>Group Information</h2>
                <img
                    src={event?.Group?.previewImage || 'https://placehold.co/600x400?text=No+Image'}
                    className="group-image"
                    alt={event?.Group?.name || 'Group'}
                    onError={(e) => {
                        console.log('Failed to load image:', event?.Group?.previewImage);
                        e.target.src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                />
                <p>{event?.Group?.name}</p>
                <p>{event?.Group?.city}, {event?.Group?.state}</p>
                <p>{event?.Group?.about}</p>
                <p>{event?.Group?.private ? 'Private' : 'Public'}</p>
            </div>
            {isHost && (
                <div className="host-actions">
                    <button onClick={handleUpdateEvent} className="button">
                        Update
                    </button>
                    <button onClick={() => setShowDeleteModal(true)} className="button delete-button">
                        Delete
                    </button>
                </div>
            )}
            {showDeleteModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to remove this event?</p>
                        <button className='button delete-confirm-button' onClick={handleDeleteEvent}>Yes (Delete Event)</button>
                        <button className='button delete-cancel-button' onClick={() => setShowDeleteModal(false)}>No (Keep Event)</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventDetailsPage;
