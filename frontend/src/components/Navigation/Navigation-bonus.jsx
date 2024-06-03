import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import '../../styles/header.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useModal } from '../../context/Modal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const { openModal } = useModal();

  return (
    <header className="header">
        <NavLink to="/" className="logo">LinkUp</NavLink>
        <nav className="nav">
          {sessionUser ? (
            <div className="auth-buttons">
              <span>Hello, {sessionUser.firstName}</span>
              <button onClick={() => { /* handle logout logic here */}}>Log Out</button>
            </div>
          ) : (
            <>
            <div className="login-button">
              <NavLink to="/login"
              onClick={() => openModal(<LoginFormModal />)}
              >Log In</NavLink>
            </div>
            <div className="signup-button">
              <NavLink to="/signup"
              onClick={() => openModal(<SignupFormModal />)}
              >Sign Up</NavLink>
            </div>
            </>
          )}
        </nav>
    </header>
  );
}

export default Navigation;
