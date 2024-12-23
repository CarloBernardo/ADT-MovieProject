import { useState, useRef, useCallback, useEffect } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');

    try {
      const res = await axios.post('/admin/login', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      console.log(res);
      localStorage.setItem('accessToken', res.data.access_token);
      navigate('/main/movies');
      setStatus('idle');
    } catch (e) {
      setError(e.response?.data?.message || 'An error occurred');
      console.error(e);
      setStatus('idle');
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      if (status === 'loading') return;

      if (email && password) {
        handleLogin();
      } else {
        setIsFieldsDirty(true);
        if (!email) {
          emailRef.current.focus();
        }
        if (!password) {
          passwordRef.current.focus();
        }
      }
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  useEffect(() => {
    document.addEventListener('keydown', handleEnterPress);
    return () => {
      document.removeEventListener('keydown', handleEnterPress);
    };
  }, [email, password, status]);

  return (
    <div className='login-page'>
      <form>
        <div className='Lform-container'>
          <h1 className="form-title">MovieDB</h1>
          <h2 className="form-title">Welcome Back!</h2>
          {error && <span className='login errors'>{error}</span>}
          <div>
            <div className='input-group'>
              <label>E-mail:</label>
              <input
                type='text'
                name='email'
                ref={emailRef}
                onChange={(e) => handleOnChange(e, 'email')}
              />
            </div>
            {debounceState && isFieldsDirty && !email && (
              <span className='input-field'>This field is required</span>
            )}
          </div>
          <div>
            <div className='input-group'>
              <label>Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                name='password'
                ref={passwordRef}
                onChange={(e) => handleOnChange(e, 'password')}
              />
            </div>
            {debounceState && isFieldsDirty && !password && (
              <span className='input-field'>This field is required</span>
            )}
          </div>
          <div className='show-password-btn' onClick={handleShowPassword}>
            {isShowPassword ? 'Hide' : 'Show'} Password
          </div>

          <div className='submit-container'>
            <button
              type='button'
              disabled={status === 'loading'}
              onClick={() => {
                if (status === 'loading') return;
                if (email && password) {
                  handleLogin();
                } else {
                  setIsFieldsDirty(true);
                  if (!email) {
                    emailRef.current.focus();
                  }
                  if (!password) {
                    passwordRef.current.focus();
                  }
                }
              }}
            >
              {status === 'idle' ? 'Login' : 'Loading'}
            </button>
          </div>
          <div className='register-container'>
            <a href='/register'>
              <small>Register</small>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
