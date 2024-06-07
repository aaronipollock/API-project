import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './EventDetailsPage.css';
import { csrfFetch } from '../../store/csrf';
import { useSelector } from 'react-redux';

function EventDetailsPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [group, setGroup] = useState(null); // Define the group state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`/api/events/${eventId}`);
                if (response.ok) {
                    const eventData = await response.json();
                    setEvent(eventData);

                    const groupRes = await fetch(`/api/groups/${eventData.groupId}`);
                    if (groupRes.ok) {
                        const groupData = await groupRes.json();
                        setGroup(groupData);
                    } else {
                        throw new Error('Failed to fetch group details');
                    }
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch event details');
                }
            } catch (err) {
                setError(err.toString());
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [eventId]);

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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const isHost = currentUser && group && currentUser.id === group.organizerId;

    return (
        <div className="event-details-page">
            <nav className="breadcrumb">
                <Link to="/events">&lt; Events</Link>
            </nav>
            <div className="event-header">
                <h1>{event.name}</h1>
                <p>Hosted by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>
            </div>
            <img src={event.image || 'default_image_url_here'} className="event-image" alt="Event" />
            <div className="event-info-box">
                <div className="event-time">
                    <i className="clock-icon" />
                    <span>START</span>
                    <span>{new Date(event.startDate).toLocaleDateString()} &middot; {new Date(event.startDate).toLocaleTimeString()}</span>
                    <span> END</span>
                    <span>{new Date(event.endDate).toLocaleDateString()} &middot; {new Date(event.endDate).toLocaleTimeString()}</span>
                </div>
                <div className="event-price">
                    <i className="money-icon" />
                    <span>{event.price > 0 ? `$${event.price}` : 'FREE'}</span>
                </div>
                <div className="event-location">
                    <i className="map-pin-icon" />
                    <span>{event.type === 'In person' ? 'In person' : 'Online'}</span>
                </div>
                <div className="event-description-section">
                    <h2>Description</h2>
                    <p>{event.description}</p>
                </div>
            </div>
            <div className="group-info-box">
                <h2>Group Information</h2>
                <p>{group?.name}</p>
                <p>{group?.city}, {group?.state}</p>
                <p>{group?.about}</p>
            </div>
            {isHost && (
                <div className="host-actions">
                    <button className="update-button" onClick={() => navigate(`/events/${eventId}/edit`)}>Update</button>
                    <button className="delete-button" onClick={handleDeleteEvent}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default EventDetailsPage;
