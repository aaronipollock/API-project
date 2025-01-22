import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import '../Header/header.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
// import * as sessionActions from '../../store/session';
import UserMenu from '../UserMenu/UserMenu';
import OpenModalButton from '../OpenModalButton/OpenModalButton';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  // const { openModal } = useModal();
  // const dispatch = useDispatch()
  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await dispatch(sessionActions.logout());
  //   navigate('/')
  // };

  return (
    <header className="header">
      <NavLink to="/" className="logo">{"{SyncUp}"}</NavLink>
      <nav className="nav">
        {sessionUser ? (
          <div className="auth-links">
            <NavLink to="/groups/new" className="start-group-link">Start a new group</NavLink>
            <UserMenu />
          </div>
        ) : (
          <>
            {/* <div className="login-button">
              <NavLink to="/login"
              onClick={() => openModal(<LoginFormModal />)}
              >Log In</NavLink>
            </div> */}
            <div>
              <OpenModalButton
                className="login-button"
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </div>
            {/* <div className="signup-button">
              <NavLink to="/signup"
                onClick={() => openModal(<SignupFormModal />)}
              >Sign Up</NavLink>
            </div> */}
            <div>
              <OpenModalButton
                className="signup-button"
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navigation;
