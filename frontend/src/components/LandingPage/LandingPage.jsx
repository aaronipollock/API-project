import './LandingPage.css'

const LandingPage = () => {
    return (
        <div className="landing-page">
            <section className="section section-1">
                <div className="text">
                    <h1>The people platform—Where interests become friendships</h1>
                    <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
                </div>
                <div className="infographic">
                    <img src="" />
                </div>
            </section>
            <section className="section section-2">
                <h3>How LinkUp Works</h3>
                <p>People use LinkUp to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.</p>
            </section>
            <section className='section section-3'>
                <div className='column'>
                    <i className='icon'></i>
                    <a href="/groups" className='link'>See all groups</a>
                    <p>Caption</p>
                </div>
                <div className='column'>
                    <i className='icon'></i>
                    <a href="/events" className='link'>Find an event</a>
                    <p>Caption</p>
                </div>
                <div className='column'>
                    <i className='icon'></i>
                    <a href="/groups" className='link'>Start a group</a>
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
