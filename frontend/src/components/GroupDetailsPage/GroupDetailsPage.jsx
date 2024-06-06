import { useDispatch, useSelector } from 'react-redux';
import { setEvents } from '../../store/events';
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { setError } from '../../store/groups';
import './GroupDetailsPage.css';

function GroupDetailsPage() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const events = useSelector((state) => state.events.events || []);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const error = useSelector((state) => state.groups.error);
    const currentUser = useSelector((state) => state.session.user);

    const isJSONResponse = (response) => {
        const contentType = response.headers.get("content-type");
        return contentType && contentType.indexOf("application/json") !== -1;
    }

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const groupRes = await fetch(`/api/groups/${groupId}`);
                const eventRes = await fetch('/api/events');

                if (!groupRes.ok) {
                    const errorText = await groupRes.text()
                    throw new Error(`Group fetch error: ${errorText}`);
                }

                if (!eventRes.ok) {
                    const errorText = await eventRes.text();
                    throw new Error(`Event fetch error: ${errorText}`);
                }

                const groupData = isJSONResponse(groupRes) ? await groupRes.json() : {};
                const eventData = isJSONResponse(eventRes) ? await eventRes.json() : {};

                const eventsWithDescriptions = await Promise.all(eventData.Events.map(async (event) => {
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

                dispatch(setEvents(eventsWithDescriptions));
                setGroup(groupData);
                setLoading(false);
            } catch (err) {
                dispatch(setError(err.toString()));
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [dispatch, groupId]);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    const groupEvents = events.filter(event => event.groupId === parseInt(groupId));

    const sortedEvents = groupEvents.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        const currentDate = new Date();

        if (dateA >= currentDate && dateB >= currentDate) {
            return dateA - dateB;
        } else if (dateA < currentDate && dateB < currentDate) {
            return dateB - dateA;
        } else if (dateA >= currentDate) {
            return -1;
        } else {
            return 1;
        }
    });

    const handleJoinGroup = () => {
        alert('Feature coming soon');
    };

    const isOrganizer = currentUser && group && currentUser.id === group.organizerId;

    return (
        <div className="group-details-page">
            <nav className="breadcrumb">
                <Link to="/groups">&lt; Groups</Link>
            </nav>
            <div className="group-details">
                <img src={group.image || 'default_image_url_here'} className="group-image" />
                <div className="group-info">
                    <h1 className="group-name">{group.name}</h1>
                    <p className="group-location">{`${group.city}, ${group.state}`}</p>
                    <div className="group-meta">
                        <span className="group-events">{groupEvents.length} events</span>
                        <span className="dot">·</span>
                        <span className="group-privacy">{group.private ? 'Private' : 'Public'}</span>
                    </div>
                    <p className="group-organizer">Organized by {`${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</p>
                    {currentUser && !isOrganizer && (
                        <button className="join-group-button" onClick={handleJoinGroup}>Join this group</button>
                    )}
                    {currentUser && isOrganizer && (
                        <div className="organizer-actions">
                            <button className="create-event-button" >Create event</button>
                            <button className="update-button">Update</button>
                            <button className="delete-button">Delete</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="group-about">
                <h2>What we&apos;re about</h2>
                <p>{group.about}</p>
            </div>
            <div className="group-events-list">
                <h2>Events ({groupEvents.length})</h2>
                <ul>
                    {sortedEvents.map(event => {
                        return (
                            <li key={event.id} className="event-item" onClick={() => window.location.href = `/events/${event.id}`}>
                                <div className="event-details">
                                <div className='event-thumbnail-container'>
                                    <img src={event.previewImage || 'default_image_url_here'} className="event-thumbnail" />
                                    <div className="event-info">
                                        <p className="event-datetime">{new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString()}</p>
                                        <h3>{event.name}</h3>
                                        <p className="event-location">{event.Venue?.city}, {event.Venue?.state}</p>
                                    </div>
                                </div>
                                    <p className="event-description">{event.description}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}

export default GroupDetailsPage;
