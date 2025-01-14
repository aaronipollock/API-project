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

                    const eventsWithDescriptions = await Promise.all([...upcomingEvents, ...pastEvents].map(async (event) => {
                        const eventDetailRes = await fetch(`/api/events/${event.id}`);
                        if (eventDetailRes.ok) {
                            const eventDetailData = await eventDetailRes.json();
                            return {
                                ...event,
                                description: eventDetailData.description,
                            };
                        }
                        return event;
                    }));

                    setEvents(eventsWithDescriptions);
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
            <div className="content-container">
                <div className="header-container">
                    <h1 className="teal-header">Events</h1>
                    <Link to="/groups" className="gray-header-link">
                        <h2 className="gray-header">Groups</h2>
                    </Link>
                </div>
                <p className="caption">Events in Meetup</p>
                <ul className="event-list">
                    {events.map((event, index) => (
                        <li key={event.id} className="event-item" onClick={() => navigate(`/events/${event.id}`)}>
                            <img src={event.previewImage || 'default_image_url_here'} className="event-thumbnail" />
                            <div className="event-info">
                                <p className="event-datetime">{new Date(event.startDate).toLocaleDateString()} · {new Date(event.startDate).toLocaleTimeString()}</p>
                                <h3 className="event-name">{event.name}</h3>
                                <p className="event-location">{event.Venue?.city}, {event.Venue?.state}</p>
                                <p className="event-description">{event.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default EventListPage;
