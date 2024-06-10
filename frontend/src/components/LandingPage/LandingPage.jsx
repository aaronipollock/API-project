// import './LandingPage.css';
// import { useSelector } from 'react-redux';
// import { FaUsers, FaCalendarAlt, FaPlusCircle } from 'react-icons/fa';

// const LandingPage = () => {
//     const sessionUser = useSelector((state) => state.session.user);

//     return (
//         <div className="landing-page">
//             <section className="section section-1">
//                 <div className="text">
//                     <h1>The people platform—Where interests become friendships</h1>
//                     <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
//                 </div>
//                 <div className="infographic">
//                     <img src="https://images.pexels.com/photos/708440/pexels-photo-708440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Infographic" />
//                 </div>
//             </section>
//             <section className="section section-2">
//                 <h3>How LinkUp Works</h3>
//                 <p>People use LinkUp to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.</p>
//             </section>
//             <section className='section section-3'>
//                 <div className='column'>
//                     <FaUsers className='icon' />
//                     <a href="/groups" className='link'>See all groups</a>
//                     <p>Caption</p>
//                 </div>
//                 <div className='column'>
//                     <FaCalendarAlt className='icon' />
//                     <a href="/events" className='link'>Find an event</a>
//                     <p>Caption</p>
//                 </div>
//                 <div className='column'>
//                     <FaPlusCircle className='icon' />
//                     {sessionUser ? (
//                         <a href="/groups/new" className='link'>Start a group</a>
//                     ) : (
//                         <span className='link-disabled'>Start a Group</span>
//                     )}
//                     <p>Caption</p>
//                 </div>
//             </section>
//             <section className='section section-4'>
//                 <button className='join-button'>Join LinkUp</button>
//             </section>
//         </div>
//     )
// }

// export default LandingPage;
import './LandingPage.css';
import { useSelector } from 'react-redux';
import { FaUsers, FaCalendarAlt, FaPlusCircle } from 'react-icons/fa';

const LandingPage = () => {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div className="landing-page">
            <section className="section section-1">
                <div className="text">
                    <h1>The people platform—Where interests become friendships</h1>
                    <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
                </div>
                <div className="infographic">
                    <img src="https://images.pexels.com/photos/708440/pexels-photo-708440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Infographic" />
                </div>
            </section>
            <section className="section section-2">
                <h3>How LinkUp Works</h3>
                <p>People use LinkUp to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.</p>
            </section>
            <section className='section section-3'>
                <div className='column'>
                    <FaUsers className='icon' />
                    <a href="/groups" className='link'>See all groups</a>
                    <p>Caption</p>
                </div>
                <div className='column'>
                    <FaCalendarAlt className='icon' />
                    <a href="/events" className='link'>Find an event</a>
                    <p>Caption</p>
                </div>
                <div className='column'>
                    <FaPlusCircle className='icon' />
                    {sessionUser ? (
                        <a href="/groups/new" className='link'>Start a group</a>
                    ) : (
                        <span className='link disabled'>Start a Group</span>
                    )}
                    <p>Caption</p>
                </div>
            </section>
            <section className='section section-4'>
                <button className='join-button'>Join LinkUp</button>
            </section>
        </div>
    )
}

export default LandingPage;
