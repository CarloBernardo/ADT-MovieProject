import { useState, useRef, useCallback, useEffect } from 'react';
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setcontactNo] = useState('');
  const [role, setRole] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const contactNoRef = useRef();
  const roleRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password, firstName, middleName, lastName, contactNo, role }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

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
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'middleName':
        setMiddleName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'contactNo':
        setcontactNo(event.target.value);
        break;
      case 'role':
        setRole(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    const data = { email, password, firstName, middleName, lastName, contactNo, role };
    setStatus('loading');
    console.log(data);

    await axios({
      method: 'post',
      url: '/admin/register',
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        navigate('/');
        setStatus('idle');
      })
      .catch((e) => {
        console.log(e);
        setStatus('idle');
        alert(e.response.data.message);
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission
      if (status === 'idle') {
        handleRegister();
      }
    }
  };

  return (
    <div className='Register'>
      <div className='main-container'>
        <form onKeyDown={handleKeyDown}>
          <div className='form-container'>
            <div>
            <h1>Register</h1>
            <div>
              <div className='form-group'>
                <label>First Name:</label>
                <input
                  type='text'
                  name='firstName'
                  ref={firstNameRef}
                  onChange={(e) => handleOnChange(e, 'firstName')}
                />
              </div>
              {debounceState && isFieldsDirty && firstName == ''}
            </div>
            <div>
              <div className='form-group'>
                <label>Middle Name:</label>
                <input
                  type='text'
                  name='middleName'
                  ref={middleNameRef}
                  onChange={(e) => handleOnChange(e, 'middleName')}
                />
              </div>
              {debounceState && isFieldsDirty && middleName == ''}
            </div>
            <div>
              <div className='form-group'>
                <label>Last Name:</label>
                <input
                  type='text'
                  name='lastName'
                  ref={lastNameRef}
                  onChange={(e) => handleOnChange(e, 'lastName')}
                />
              </div>
              {debounceState && isFieldsDirty && lastName == ''}
            </div>
            <div>
              <div className='form-group'>
                <label>Contact Number:</label>
                <input
                  type='text'
                  name='contactNo'
                  ref={contactNoRef}
                  onChange={(e) => handleOnChange(e, 'contactNo')}
                />
              </div>
              {debounceState && isFieldsDirty && contactNo == ''}
            </div>
            <div>
              <div className='form-group'>
                <label>Role:</label>
                <input
                  type='text'
                  name='role'
                  ref={roleRef}
                  onChange={(e) => handleOnChange(e, 'role')}
                />
              </div>
              {debounceState && isFieldsDirty && role == ''}
            </div>
              <div className='form-group'>
                <label>Email:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
              {debounceState && isFieldsDirty && email == ''}
              </div>
            <div>
              <div className='form-group'>
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              {debounceState && isFieldsDirty && password == ''}
            </div>
            <div className='show-password' onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className='submit-container'>
            <button
                type="button"
                disabled={status === 'loading'}
                onClick={() => {
                  if (status === 'loading') return;

                  
                  setIsFieldsDirty(true);

                  
                  if (!email) {
                    emailRef.current.focus();
                  } else if (!password) {
                    passwordRef.current.focus();
                  } else if (!firstName) {
                    firstNameRef.current.focus();
                  } else if (!middleName) {
                    middleNameRef.current.focus();
                  } else if (!lastName) {
                    lastNameRef.current.focus();
                  } else if (!contactNo) {
                    contactNoRef.current.focus();
                  } else if (!role) {
                    roleRef.current.focus();
                  } else {
                    
                    handleRegister();
                  }
                }}
              >
                {status === 'idle' ? 'Register' : 'Loading'}
              </button>
            </div>
            <div className='register-container'>
              <span><small>Already have an account?<a href='/'>Login</a></small></span>
            </div>
          </div>
        </form>
      </div>
    </div>
    
  );
}



export default Register;
