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

  const handleCredentialChange = (e) => {
    setCredential(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
      </form>
    </>
  );
}

export default LoginFormModal;
