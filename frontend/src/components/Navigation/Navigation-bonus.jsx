import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import '../Header/header.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useModal } from '../../context/Modal';
// import * as sessionActions from '../../store/session';
import UserMenu from '../UserMenu/UserMenu';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const { openModal } = useModal();
  // const dispatch = useDispatch()
  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await dispatch(sessionActions.logout());
  //   navigate('/')
  // };

  return (
    <header className="header">
        <NavLink to="/" className="logo">LinkUp</NavLink>
        <nav className="nav">
          {sessionUser ? (
            <div className="auth-links">
              <NavLink to="/groups/new" className="start-group-link">Start a new group</NavLink>
              <UserMenu />
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
