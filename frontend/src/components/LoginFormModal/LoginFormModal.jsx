import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { closeModal } = useModal();

  useEffect(() => {
    const validateForm = () => {
      setIsFormValid(credential.length >= 4 && password.length >= 6)
    };
    validateForm();
  }, [credential, password])

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
        setErrors({ credential: "The provided credentials were invalid" })
      } else {
        closeModal();
      }
    } catch (error) {
      console.error('Error logging in as demo user:', error);
      setErrors({ credential: "The provided credentials were invalid" })
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setErrors({});
      return dispatch(sessionActions.login({ credential, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors({ credential: "The provided credentials were invalid" });
          }
        });
    }
  };

  return (
    <div className="login-modal-container">
      <div className="login-card-container">
        <h1>Log In</h1>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Username or Email
              <input
                id='credential'
                type="text"
                value={credential}
                onChange={handleCredentialChange}
                required
                className={errors.credential ? 'input-error' : ''}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={errors.credential ? 'input-error' : ''}
              />
            </label>
          </div>
          <div className="error-container">
            {errors.credential && <p className="error-message">{errors.credential}</p>}
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className="login-button-modal"
          >
            Log In
          </button>
          <div className="demo-button-container">
            <button
              type="button"
              className='demo-user-link'
              onClick={handleDemoLogin}
            >
              Log in as Demo User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginFormModal;
