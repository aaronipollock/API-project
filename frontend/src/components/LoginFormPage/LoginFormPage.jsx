import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
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
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;
