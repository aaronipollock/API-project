import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf';
import './CreateEventForm.css';

function CreateEventForm() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [price, setPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [capacity] = useState(0);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const groupRes = await csrfFetch(`/api/groups/${groupId}`);
                if (groupRes.ok) {
                    const groupData = await groupRes.json();
                    setGroup(groupData);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchGroupDetails();
    }, [groupId]);

    useEffect(() => {
        return () => {
            setName('');
            setType('');
            setPrivacy('');
            setPrice('');
            setStartDate('');
            setEndDate('');
            setImageUrl('');
            setDescription('');
            setErrors({});
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (!type) newErrors.type = 'Event type is required';
        if (!privacy) newErrors.privacy = 'Visibility is required';
        if (!price) newErrors.price = 'Price is required';
        if (!startDate) newErrors.startDate = 'Event start is required';
        if (!endDate) newErrors.endDate = 'Event end is required';
        if (!imageUrl) newErrors.imageUrl = 'Image URL is required';
        if (description.length < 30) newErrors.description = 'Description needs 30 or more characters';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // First create the event
            const eventResponse = await csrfFetch(`/api/groups/${groupId}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    venueId: null,
                    name,
                    type,
                    capacity: parseInt(capacity),
                    price: parseFloat(price),
                    description,
                    startDate,
                    endDate
                })
            });

            if (!eventResponse.ok) {
                throw new Error('Failed to create event');
            }

            const newEvent = await eventResponse.json();

            // Then add the image to the event
            const imageResponse = await csrfFetch(`/api/events/${newEvent.id}/images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: imageUrl,
                    preview: true
                })
            });

            if (!imageResponse.ok) {
                throw new Error('Failed to add image');
            }

            // Navigate to the new event page
            navigate(`/events/${newEvent.id}`);
        } catch (error) {
            alert(error.message);
        }
    };

    if (!group) {
        return <div className="modal-loading">Loading...</div>;
    }

    return (
        <div className="create-event-form">
            <h1>Create a new event for<br />{group?.name}</h1>
            <p>We&apos;ll walk you through a few steps to create your event.</p>

            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <h2>What is the name of your event?</h2>
                    <p>Choose a name that will give people a clear idea of what the event is about.</p>
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </section>

                <section className="form-section">
                    <h2>Event Details</h2>
                    <p>Help people know what to expect.</p>

                    <label>Is this an in-person or online event?</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Select one</option>
                        <option value="Online">Online</option>
                        <option value="In person">In person</option>
                    </select>
                    {errors.type && <span className="error">{errors.type}</span>}

                    <label>Is this event private or public?</label>
                    <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                        <option value="">Select one</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                    </select>
                    {errors.privacy && <span className="error">{errors.privacy}</span>}

                    <label>What is the price for your event?</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {errors.price && <span className="error">{errors.price}</span>}
                </section>

                <section className="form-section">
                    <h2>When is your event?</h2>
                    <p>Let people know when to show up.</p>

                    <label>Start Date and Time</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    {errors.startDate && <span className="error">{errors.startDate}</span>}

                    <label>End Date and Time</label>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    {errors.endDate && <span className="error">{errors.endDate}</span>}
                </section>

                <section className="form-section">
                    <h2>Describe your event</h2>
                    <p>Give people an idea of what they&apos;ll be doing.</p>
                    <textarea
                        placeholder="Please include at least 30 characters."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                </section>

                <section className="form-section">
                    <h2>Add an image</h2>
                    <p>Help people visualize your event.</p>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
                </section>

                <button type="submit" className="submit-button">
                    Create Event
                </button>
            </form>
        </div>
    );
}

export default CreateEventForm;
