import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import './UpdateGroupForm.css';
import { csrfFetch } from '../../store/csrf';

function UpdateGroupForm() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.session.user)

    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGroupDetails = async () => {
            const response = await fetch(`/api/groups/${groupId}`);
            if (response.ok) {
                const groupData = await response.json();

                if (!currentUser || currentUser.id !== groupData.organizerId) {
                    navigate('/');
                    return;
                }

                setLocation(`${groupData.city}, ${groupData.state}`);
                setName(groupData.name);
                setDescription(groupData.about);
                setType(groupData.type);
                setPrivacy(groupData.private ? 'private' : 'public');
                setImageUrl(groupData.imageUrl || '');
                setLoading(false);
            } else {
                alert('Failed to fetch group details');
                navigate('/');
            }
        };

        fetchGroupDetails();
    }, [groupId, currentUser, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!location) newErrors.location = 'Location is required';
        if (!name) newErrors.name = 'Name is required';
        if (description.length < 50) newErrors.description = 'Description needs 50 or more characters';
        if (!type) newErrors.type = 'Group type is required';
        if (!privacy) newErrors.privacy = 'Privacy setting is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const groupData = { location, name, about: description, type, privacy, imageUrl };
        const response = await csrfFetch(`/api/groups/${groupId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupData)
        });

        if (response.ok) {
            navigate(`/groups/${groupId}`);
        } else {
            alert('Failed to update group');
        }
    };

    if(loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="create-group-form">
            <h1>Update your Group</h1>
            <p>We&apos;ll walk you through a few steps to build your local community</p>
            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <h2>Set your group&apos;s location.</h2>
                    <p>LinkUp groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>
                    <input
                        type="text"
                        placeholder="City, STATE"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors.location && <p className="error-message">{errors.location}</p>}
                </section>
                <section className="form-section">
                    <h2>What will your group&apos;s name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        type="text"
                        placeholder="What is your group name?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </section>
                <section className="form-section">
                    <h2>Describe the purpose of your group.</h2>
                    <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                    <p>1. What&apos;s the purpose of the group?</p>
                    <p>2. Who should join?</p>
                    <p>3. What will you do at your events?</p>
                    <textarea
                        placeholder="Please write at least 50 characters"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </section>
                <section className="form-section">
                    <h2>Final steps...</h2>
                    <label>Is this an in-person or online group?</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    {errors.type && <p className="error-message">{errors.type}</p>}
                    <label>Is this group private or public?</label>
                    <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                    {errors.privacy && <p className="error-message">{errors.privacy}</p>}
                    <label>Please add an image URL for your group below:</label>
                    <input
                        type="text"
                        placeholder="Image Url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    {errors.imageUrl && <p className="error-message">{errors.imageUrl}</p>}
                </section>
                <button type="submit" className="create-group-button">Update Group</button>
            </form>
        </div>
    );
}

export default UpdateGroupForm;
