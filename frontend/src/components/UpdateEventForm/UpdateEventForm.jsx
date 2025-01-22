import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf';
import './UpdateEventForm.css';

function UpdateEventForm() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [venueId, setVenueId] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [group, setGroup] = useState(null);

    // Fetch existing event data
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`/api/events/${eventId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Format dates to match input type="datetime-local"
                    const formatDate = (dateString) => {
                        const date = new Date(dateString);
                        return date.toISOString().slice(0, 16);
                    };

                    setName(data.name);
                    setType(data.type);
                    setPrice(data.price);
                    setStartDate(formatDate(data.startDate));
                    setEndDate(formatDate(data.endDate));
                    setDescription(data.description);
                    setCapacity(data.capacity);
                    setVenueId(data.venueId);

                    // Fetch group details
                    const groupRes = await fetch(`/api/groups/${data.groupId}`);
                    if (groupRes.ok) {
                        const groupData = await groupRes.json();
                        setGroup(groupData);
                    }

                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching event:', error);
                setIsLoading(false);
            }
        };
        fetchEventData();
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = {};
        if (!name) validationErrors.name = "Name is required";
        if (!type) validationErrors.type = "Type is required";
        if (!description) validationErrors.description = "Description is required";
        if (!capacity || capacity < 1) validationErrors.capacity = "Capacity must be at least 1";
        if (price < 0) validationErrors.price = "Price cannot be negative";
        if (!startDate) validationErrors.startDate = "Start date is required";
        if (!endDate) validationErrors.endDate = "End date is required";
        if (new Date(startDate) > new Date(endDate)) {
            validationErrors.endDate = "End date must be after start date";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await csrfFetch(`/api/events/${eventId}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    venueId: parseInt(venueId),
                    name,
                    type,
                    capacity: parseInt(capacity),
                    price: parseFloat(price),
                    description,
                    startDate,
                    endDate
                })
            });

            if (response.ok) {
                const updatedEvent = await response.json();
                navigate(`/events/${eventId}`);
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || { submit: 'Failed to update event' });
            }
        } catch (error) {
            console.error('Error updating event:', error);
            setErrors({ submit: 'Failed to update event' });
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="update-event-form">
            <h1>Update event for<br />{group?.name}</h1>
            <p>We'll walk you through a few steps to update your event.</p>

            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <h2>What is the name of your event?</h2>
                    <p>Choose a name that will give people a clear idea of what the event is about.</p>
                    <input
                        type="text"
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
                        <option value="In person">In Person</option>
                        <option value="Online">Online</option>
                    </select>
                    {errors.type && <span className="error">{errors.type}</span>}

                    <label>What is the price for your event?</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                    {errors.price && <span className="error">{errors.price}</span>}

                    <label>What is the capacity for your event?</label>
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        min="1"
                    />
                    {errors.capacity && <span className="error">{errors.capacity}</span>}
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
                    <p>Give people an idea of what they'll be doing.</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <span className="error">{errors.description}</span>}
                </section>

                <button type="submit" className="submit-button">
                    Update Event
                </button>
            </form>
        </div>
    );
}

export default UpdateEventForm;
