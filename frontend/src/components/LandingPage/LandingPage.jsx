import './LandingPage.css';
import { useSelector } from 'react-redux';
import { FaUsers, FaCalendarAlt, FaPlusCircle } from 'react-icons/fa';
import meetingImage from '../../images/color.jpg';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import SignupFormModal from '../SignupFormModal';


const LandingPage = () => {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div className="landing-page">
            <section className="section section-1">
                <div className="text">
                    <h1>The tech hub where innovation sparks connection</h1>
                    <p>Whatever your tech passion—be it coding, AI, blockchain, or cloud computing—there’s a thriving community waiting for you on SyncUp. Events and workshops happen daily—sign up to build, learn, and innovate with like-minded tech enthusiasts.</p>
                </div>
                <div className="infographic">
                    <img src={meetingImage} alt="Team collaborating around a wooden table with laptops" />
                </div>
            </section>
            <section className="section section-2">
                <h3>How SyncUp Works</h3>
                <p>SyncUp connects tech professionals, learners, and innovators to explore new ideas, master cutting-edge skills, find mentorship, and collaborate on exciting projects. Membership is free—your journey into tech starts here!</p>
            </section>
            <section className='section section-3'>
                <div className='column'>
                    <FaUsers className='icon' />
                    <a href="/groups" className='link'>See all groups</a>
                    <p>A one-stop view of all tech groups ready to inspire your next big idea.</p>
                </div>
                <div className='column'>
                    <FaCalendarAlt className='icon' />
                    <a href="/events" className='link'>Find an event</a>
                    <p>See who's hosting local events for all the things you love</p>
                </div>
                <div className='column'>
                    <FaPlusCircle className='icon' />
                    {sessionUser ? (
                        <a href="/groups/new" className='link'>Start a group</a>
                    ) : (
                        <span className='link disabled'>Start a Group</span>
                    )}
                    <p>Once you sign up, create your own SyncUp group, and draw from a community of millions</p>
                </div>
            </section>
            <section className='section section-4'>
            <div>
              <OpenModalButton
                className="join-button"
                buttonText="Join SyncUp"
                modalComponent={<SignupFormModal />}
              />
            </div>
            </section>
        </div>
    )
}

export default LandingPage;
