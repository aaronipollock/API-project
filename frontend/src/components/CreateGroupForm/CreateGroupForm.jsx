import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateGroupForm.css'
import { csrfFetch } from '../../store/csrf';

function CreateGroupForm() {
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const validateForm = () => {
        const newErrors = {};
        if (!location) newErrors.location = 'Location is required';
        if (!name) newErrors.name = 'Name is required';
        if (description.length < 30) newErrors.description = 'Description needs 50 or more characters';
        if (!type) newErrors.type = 'Group type is required';
        if (!privacy) newErrors.privacy = 'Privacy is required';
        if (!imageUrl) newErrors.imageUrl = 'Image URL is required';
        return newErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const [city, state] = location.split(', ').map(part => part.trim());

        try {
            // First create the group
            const groupResponse = await csrfFetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    about: description,
                    type,
                    private: privacy === 'private',
                    city,
                    state
                })
            });

            if (!groupResponse.ok) {
                throw new Error('Failed to create group');
            }

            const newGroup = await groupResponse.json();

            // Then add the image to the group
            const imageResponse = await csrfFetch(`/api/groups/${newGroup.id}/images`, {
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

            // Navigate to the new group page
            navigate(`/groups/${newGroup.id}`);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        return () => {
            setLocation('');
            setName('');
            setDescription('');
            setType('');
            setPrivacy('');
            setImageUrl('');
            setErrors({});
        }
    }, [])

    return (
        <div className="create-group-form">
            <title>Start a new group</title>
            <h1>Start a new group</h1>
            <p>We&apos;ll walk you through a few steps to build your local community.</p>
            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <h2>Set your group&apos;s location.</h2>
                    <p>SyncUp groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>
                    <input type="text" placeholder="City, STATE" value={location} onChange={(e) => setLocation(e.target.value)} />
                    {errors.location && <p className="error-message">{errors.location}</p>}
                </section>
                <section className="form-section">
                    <h2>What will your group&apos;s name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input type="text" placeholder="What is your group name?" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </section>
                <section className="form-section">
                    <h2>Describe the purpose of your group.</h2>
                    <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                    <p>1. What&apos;s the purpose of the group?</p>
                    <p>2. Who should join?</p>
                    <p>3. What will you do at your events?</p>
                    <textarea placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)} />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </section>
                <section className="form-section">
                    <h2>Final steps...</h2>
                    <label>Is this an in-person or online group?</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">(select one)</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    {errors.type && <p className="error-message">{errors.type}</p>}
                    <label>Is this group private or public?</label>
                    <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                        <option value="">(select one)</option>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                    {errors.privacy && <p className="error-message">{errors.privacy}</p>}
                    <label>Please add an image URL for your group below:</label>
                    <input type="text" placeholder="Image Url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    {errors.imageUrl && <p className="error-message">{errors.imageUrl}</p>}
                </section>
                <button type="submit" className="create-group-button">Create Group</button>
            </form>
        </div>
    )
}

export default CreateGroupForm;
