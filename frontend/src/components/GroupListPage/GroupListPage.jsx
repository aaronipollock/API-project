import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setGroups, setError } from '../../store/groups';
import { setEvents } from '../../store/events';
import './GroupListPage.css';

const GroupListPage = () => {
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups || []);
    const events = useSelector((state) => state.events.events || []);
    const error = useSelector((state) => state.groups.error);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroupsAndEvents = async () => {
            try {
                const groupRes = await fetch('/api/groups');
                const eventRes = await fetch('/api/events');
                if (!groupRes.ok || !eventRes.ok) {
                    throw new Error("Network response was not ok")
                }
                const groupData = await groupRes.json();
                const eventData = await eventRes.json();

                dispatch(setGroups(groupData.Groups));
                dispatch(setEvents(eventData.Events));
                setLoading(false);
            } catch (err) {
                dispatch(setError(err.toString()));
                setLoading(false);
            }
        };

        fetchGroupsAndEvents();
    }, [dispatch]);

    const numEvents = (groupId) => {
        return events.filter(event => event.groupId === groupId).length
    }

    let content;

    if (loading) {
        content = <p>Loading...</p>
    } else if (error) {
        content = <p>{error}</p>;
    } else {
        content = (
            <ul className="group-list">
                {groups.map((group) => (
                    <li key={group.id} className="group-item" onClick={() => window.location.href = `/groups/${group.id}`}>
                        <img src={group.image || 'default_image_url_here'} className="group-image" />
                        <div className="group-info">
                            <h2 className="group-name">{group.name}</h2>
                            <p className="group-location">{`${group.city}, ${group.state}`}</p>
                            <p className="group-description">{group.about}</p>
                            <div className="group-meta">
                                <span className="group-events">{numEvents(group.id)} events</span>
                                <span className="dot">·</span>
                                <span className="group-privacy">{group.private ? 'Private' : 'Public'}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="group-list-page">
            <div className='content-container'>
                <div className="header-container">
                    <Link to="/events" className="header events-header events-link">
                        Events
                    </Link>
                    <header className="header groups-header groups-link">
                        Groups
                    </header>
                </div>
                <p className="caption">Groups in LinkUp</p>
                {content}
            </div>
        </div>
    )
};

export default GroupListPage;
