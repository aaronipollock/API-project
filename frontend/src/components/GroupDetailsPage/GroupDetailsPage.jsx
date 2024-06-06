import { useDispatch, useSelector } from 'react-redux';
import { setEvents } from '../../store/events';
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { setError } from '../../store/groups';
import './GroupDEtailsPage.css';

function GroupDetailsPage() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const events = useSelector((state) => state.events.events || []);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const error = useSelector((state) => state.groups.error);

    const isJSONResponse = (response) => {
        const contentType = response.headers.get("content-type");
        return contentType && contentType.indexOf("application/json") !== -1;
    }

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const groupRes = await fetch(`/api/groups/${groupId}`);
                const eventRes = await fetch('api/events');
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

                dispatch(setEvents(eventData.Events));
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

    const numEvents = (groupId) => {
        return events.filter(event => event.groupId === groupId).length
    }

    return (
        <div className="group-details-page">
            <nav className="breadcrumb">
                <Link to="/groups">Back to Groups</Link>
            </nav>
            <div className="group-details">
                <img src={group.image || 'default_image_url_here'} className="group-image" />
                <div className="group-info">
                    <h1 className="group-name">{group.name}</h1>
                    <p className="group-location">{`${group.city}, ${group.state}`}</p>
                    <div className="group-meta">
                        <span className="group-events">{numEvents(group.id)} events</span>
                        <span className="dot">·</span>
                        <span className="group-privacy">{group.private ? 'Private' : 'Public'}</span>
                    </div>
                    <p className="group-organizer">Organized by {`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
                    <button className="join-group-button">Join this group</button>
                </div>
            </div>
            <div className="group-about">
                <h2>What we&apos;re about</h2>
                <p>{group.about}</p>
            </div>
            <div className="group-events-list">
                <h2>Upcoming Events</h2>
                <ul>
                    {groupEvents.map(event => (
                        <li key={event.id}>
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default GroupDetailsPage;
