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
        // if (!imageUrl) newErrors.imageUrl = 'Image URL is required';
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

        const eventData = { name, type, privacy, price, startDate, endDate, imageUrl, description };
        // console.log('Event Data:', eventData);

        try {
            const eventRes = await csrfFetch(`/api/groups/${groupId}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (eventRes.ok) {
                const newEvent = await eventRes.json();
                // console.log('New Event:', newEvent);
                navigate(`/events/${newEvent.id}`);
            }
            // else {
            //     const errorData = await eventRes.json();
            //     // console.error('Error:', errorData);
            //     alert('Failed to create event');
            // }
        } catch (err) {
            console.error('Request Error:', err);
        }
    };

    if (!group) {
        return <p>Loading group details...</p>
    }

    return (
        <div className="create-event-form">
            <h1>Create a new event for {group.name}</h1>
            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <label htmlFor="name">What is the name of your event?</label>
                    <input type="text" id="name" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </section>
                <section className='form-section'>
                    <label htmlFor="type">Is this an in-person or online event?</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Select one</option>
                        <option value="Online">Online</option>
                        <option value="In person">In person</option>
                    </select>
                    {errors.type && <p className="error-message">{errors.type}</p>}
                </section>
                <section className="form-section">
                    <label htmlFor="privacy">Visibility</label>
                    <select id="privacy" value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                        <option value="">Select one</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                    </select>
                    {errors.privacy && <p className="error-message">{errors.privacy}</p>}
                </section>
                <section className="form-section">
                    <label htmlFor="price">What is the price for you event?</label>
                    <input type="number" id="price" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                    {errors.price && <p className="error-message">{errors.price}</p>}
                </section>
                <section className='form-section'>
                    <label htmlFor="startDate">When does your event start?</label>
                    <input type="datetime-local" id="startDate" placeholder="MM/DD/YYYY, HH:mm AM" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    {errors.startDate && <p className="error-message">{errors.startDate}</p>}
                </section>
                <section className='form-section'>
                    <label htmlFor="endDate">When does your event end?</label>
                    <input type="datetime-local" id="endDate" placeholder="MM/DD/YYYY, HH:mm PM" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    {errors.endDate && <p className="error-message">{errors.endDate}</p>}
                </section>
                <section className='form-section'>
                    <label htmlFor="imageUrl">Please add an image URL for your event below:</label>
                    <input type="text" id="imageUrl" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    {errors.imageUrl && <p className="error-message">{errors.imageUrl}</p>}
                </section>
                <section className='form-section'>
                    <label htmlFor="description">Please describe your event</label>
                    <textarea id="description" placeholder='Please include at least 30 characters.' value={description} onChange={(e) => setDescription(e.target.value)} />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </section>
                <button type="submit" className='create-event-button'>Create Event</button>
            </form>
        </div>
    );
}

export default CreateEventForm;
