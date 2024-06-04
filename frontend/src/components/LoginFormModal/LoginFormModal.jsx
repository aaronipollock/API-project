import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';
import { Link } from 'react-router-dom';


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { closeModal } = useModal();

  const handleCredentialChange = (e) => {
    setCredential(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

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

  useEffect(() => {
    const validateForm = () => {
      setIsFormValid(credential.length >= 4 && password.length >= 6)
    };
    validateForm();
  }, [credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrors({});
      return dispatch(sessionActions.login({ credential, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors({ credential: "The provided credentials were invalid"});
          }
        });
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label>
          <input
            id='credential'
            type="text"
            value={credential}
            onChange={handleCredentialChange}
            required
          />
        </label>
        <label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" disabled={!isFormValid} id="loginButton">Log In</button>
        <div>
            <Link to="#" className='demo-user-link' onClick={handleDemoLogin}>Log in as Demo User</Link>
          </div>
      </form>
    </>
  );
}

export default LoginFormModal;
