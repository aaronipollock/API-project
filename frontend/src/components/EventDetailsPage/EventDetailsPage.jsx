// import { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import './EventDetailsPage.css';
// import { csrfFetch } from '../../store/csrf';
// import { useSelector } from 'react-redux';
// import { FaClock, FaDollarSign, FaMapPin } from 'react-icons/fa';

// function EventDetailsPage() {
//     const { eventId } = useParams();
//     const navigate = useNavigate();
//     const [event, setEvent] = useState(null);
//     const [group, setGroup] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const currentUser = useSelector((state) => state.session.user);

//     useEffect(() => {
//         const fetchEventDetails = async () => {
//             try {
//                 const response = await fetch(`/api/events/${eventId}`);
//                 if (response.ok) {
//                     const eventData = await response.json();
//                     setEvent(eventData);

//                     const groupRes = await fetch(`/api/groups/${eventData.groupId}`);
//                     if (groupRes.ok) {
//                         const groupData = await groupRes.json();
//                         setGroup(groupData);
//                     } else {
//                         throw new Error('Failed to fetch group details');
//                     }
//                     setLoading(false);
//                 } else {
//                     throw new Error('Failed to fetch event details');
//                 }
//             } catch (err) {
//                 setError(err.toString());
//                 setLoading(false);
//             }
//         };
//         fetchEventDetails();
//     }, [eventId]);

//     const handleDeleteEvent = async () => {
//         const response = await csrfFetch(`/api/events/${eventId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         });

//         if (response.ok) {
//             navigate('/events');
//         } else {
//             alert('Failed to delete event');
//         }
//     };

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     const isHost = currentUser && group && currentUser.id === group.organizerId;

//     return (
//         <div className="event-details-page">
//             <nav className="breadcrumb">
//                 <Link to="/events">&lt; Events</Link>
//             </nav>
//             <div className="event-header">
//                 <h1>{event.name}</h1>
//                 <p>Hosted by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>
//             </div>
//             <div className="event-content">
//                 <img src={event.image || 'default_image_url_here'} className="event-image" alt="Event" />
//                 <div className="event-info-box">
//                     <div className="group-info">
//                         <img src={group.image || 'default_image_url_here'} className="group-image" alt="Group" />
//                         <p>{group?.name}</p>
//                         <p>{group?.private ? 'Private' : 'Public'}</p>
//                     </div>
//                     <div className="event-time">
//                         <FaClock className="icon" />
//                         <span>START</span>
//                         <span>{new Date(event.startDate).toLocaleDateString()} &middot; {new Date(event.startDate).toLocaleTimeString()}</span>
//                         <span>END</span>
//                         <span>{new Date(event.endDate).toLocaleDateString()} &middot; {new Date(event.endDate).toLocaleTimeString()}</span>
//                     </div>
//                     <div className="event-price">
//                         <FaDollarSign className="icon" />
//                         <span>{event.price > 0 ? `$${event.price}` : 'FREE'}</span>
//                     </div>
//                     <div className="event-location">
//                         <FaMapPin className="icon" />
//                         <span>{event.type === 'In person' ? 'In person' : 'Online'}</span>
//                     </div>
//                 </div>
//             </div>
//             <div className="event-description-section">
//                 <h2>Description</h2>
//                 <p>{event.description}</p>
//             </div>
//             <div className="group-info-box">
//                 <h2>Group Information</h2>
//                 <p>{group?.name}</p>
//                 <p>{group?.city}, {group?.state}</p>
//                 <p>{group?.about}</p>
//             </div>
//             {isHost && (
//                 <div className="host-actions">
//                     <button className="button" onClick={() => navigate(`/events/${eventId}/edit`)}>Update</button>
//                     <button className="button" onClick={() => setShowDeleteModal(true)}>Delete</button>
//                 </div>
//             )}
//             {showDeleteModal && (
//                 <div className='modal'>
//                     <div className='modal-content'>
//                         <h2>Confirm Delete</h2>
//                         <p>Are you sure you want to remove this event?</p>
//                         <button className='button delete-confirm-button' onClick={handleDeleteEvent}>Yes (Delete Event)</button>
//                         <button className='button delete-cancel-button' onClick={() => setShowDeleteModal(false)}>No (Keep Event)</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default EventDetailsPage;
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
            <div className="event-content">
                <img src={event.image || 'default_image_url_here'} className="event-image" alt="Event" />
                <div className="event-info-box">
                    <div className="event-time">
                        <FaClock className="icon" />
                        <span>START</span>
                        <span>{new Date(event.startDate).toLocaleDateString()} &middot; {new Date(event.startDate).toLocaleTimeString()}</span>
                        <span>END</span>
                        <span>{new Date(event.endDate).toLocaleDateString()} &middot; {new Date(event.endDate).toLocaleTimeString()}</span>
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
                <img src={group.image || 'default_image_url_here'} className="group-image" alt="Group" />
                <p>{group?.name}</p>
                <p>{group?.city}, {group?.state}</p>
                <p>{group?.about}</p>
                <p>{group?.private ? 'Private' : 'Public'}</p>
            </div>
            {isHost && (
                <div className="host-actions">
                    <button className="button" onClick={() => navigate(`/events/${eventId}/edit`)}>Update</button>
                    <button className="button" onClick={() => setShowDeleteModal(true)}>Delete</button>
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

