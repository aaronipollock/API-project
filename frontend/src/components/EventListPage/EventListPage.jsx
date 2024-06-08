import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './EventListPage.css';

const EventListPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventRes = await fetch('/api/events');
                if (eventRes.ok) {
                    const eventData = await eventRes.json();
                    const upcomingEvents = eventData.Events.filter(event => new Date(event.startDate) >= new Date());
                    const pastEvents = eventData.Events.filter(event => new Date(event.startDate) < new Date());
                    setEvents([...upcomingEvents, ...pastEvents]);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch events');
                }
            } catch (err) {
                setError(err.toString());
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="event-list-page">
            <h1 className="teal-header">Events</h1>
            <h2 className="gray-header">Groups</h2>
            <caption>Events in LinkUp</caption>
            <ul className="event-list">
                {events.map(event => (
                    <li key={event.id} className="event-item" onClick={() => navigate(`/events/${event.id}`)}>
                        <div className="event-details">
                            <div className="event-thumbnail-container">
                                <img src={event.previewImage || 'default_image_url_here'} className="event-thumbnail" />
                                <div className="event-info">
                                    <p className="event-datetime">{new Date(event.startDate).toLocaleDateString()} &middot; {new Date(event.startDate).toLocaleTimeString()}</p>
                                    <h3>{event.name}</h3>
                                    <p className="event-location">{event.Venue?.city}, {event.Venue?.state}</p>
                                </div>
                            </div>
                            <p clasName="event-description">{event.description}</p>
                        </div>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EventListPage;
