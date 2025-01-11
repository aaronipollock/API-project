import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
// import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ? (
    <div className="auth-links">
      <NavLink to="/groups/new" className="start-group-link">Start a new group</NavLink>
      <ProfileButton user={sessionUser} />
    </div>
  ) : (
    <>
      <div>
        <OpenModalButton
          className="login-button"
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
      </div>
      <div>
        <OpenModalButton
          className="signup-button"
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
    </>
  );

  return (
    <header className="header">
      <NavLink to="/" className="logo">SyncUp</NavLink>
      <nav className="nav">
        {isLoaded && sessionLinks}
      </nav>
    </header>
  );
}

export default Navigation;
