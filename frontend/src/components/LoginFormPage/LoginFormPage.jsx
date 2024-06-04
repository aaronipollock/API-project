import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import './LoginFormPage.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      }
    );
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    try {
      const demoCredential = 'demo@user.io';
      const demoPassword = 'password';

      const response = await dispatch(sessionActions.login({
        credential: demoCredential,
        password: demoPassword
      }));

      if (response.error) {
        setErrors({ credential: "The provided credentials were invalid"})
      }
    } catch (error) {
      console.error('Error logging in as demo user:', error);
      setErrors({ credential: "The provided credentials were invalid"})
    }
  }



  return (
    <div className='login-modal-container'>
      <div className='login-card-container'>
        <h1 className='login-text'>Log In</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <div>
              <input className='input'
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                placeholder='Username or Email'
              />
            </div>
          </label>
          <label className='password-input'>
            <div>
              <input className='input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Password'
              />
            </div>
          </label>
          {errors.credential && <p>{errors.credential}</p>}
          <div className='login-page-button'>
            <button className="login-modal-button" type="submit">Log In</button>
          </div>
          <div>
            <Link to="#" className='demo-user-link' onClick={handleDemoLogin}>Log in as Demo User</Link>
          </div>
        </form>
      </div>
    </div>
  );
}


export default LoginFormPage;
