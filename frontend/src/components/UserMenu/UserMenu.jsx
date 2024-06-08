import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import * as sessionActions from '../../store/session';
import './UserMenu.css';

function UserMenu() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = async () => {
        await dispatch(sessionActions.logout());
        setShowMenu(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu-dropdown') && !event.target.closest('.user-menu-button')) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-menu-container">
            {sessionUser && (
                <>
                    <button className="user-menu-button" onClick={toggleMenu}>
                        User Menu
                    </button>
                    {showMenu && (
                        <div className="user-menu-dropdown">
                            <p>Hello, {sessionUser.firstName}</p>
                            <p>{sessionUser.email}</p>
                            <div>
                                <a href="/groups" className="menu-link">View groups</a>
                            </div>
                            <div>
                                <a href="/events" className="menu-link">View events</a>
                            </div>
                            <button onClick={handleLogout} className="logout-button">Log Out</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default UserMenu;
