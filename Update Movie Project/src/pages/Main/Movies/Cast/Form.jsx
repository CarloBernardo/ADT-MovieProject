import React, { useContext, useEffect, useRef, useState } from 'react'
import './Cast.css'
import { useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { AuthContext } from '../../../../context/context.js';
import axios from 'axios';

function Form({ data, state, setState }) {
  const { auth } = useContext(AuthContext);
  let { tmdbId, movieId } = useParams();

  const [selectedData, setSelectedData] = useState(data);
  const [file, setFile] = useState(null); // Use state to manage the file
  const urlRef = useRef();
  const nameRef = useRef();
  const characterNameRef = useRef();

  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();
  const userInputDebounce = useDebounce({ selectedData }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);

  // alert box state
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setSelectedData(data);
  }, [data]);

  // Handle file input change and set the file in state
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);  // Update the file state
    console.log(uploadedFile);  // This will log the file when it changes
  };

  const handleOnChange = (e) => {
    setDebounceState(false);
    setIsFieldsDirty(true);
    const { name, value } = e.target;

    setSelectedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(selectedData);
    
  };

  //debounce
    useEffect(() => {
      setDebounceState(true);
    }, [userInputDebounce]);

  function convertToEmbedUrl(youtubeUrl) {

    const castIdMatch = youtubeUrl.match(/v=([^&]+)/);

    if (castIdMatch && castIdMatch[1]) {
      const castId = castIdMatch[1];

      return `https://www.youtube.com/embed/${castId}`;
    } else {
      // Return the original URL if it doesn't match the pattern
      return youtubeUrl;
    }
  }

  const handleSave = async (event) => {
    //event.preventDefault();
    // if (!file) {
    //   setIsError(true);
    //   setAlertMessage('No file selected');
    //   setTimeout(() => setAlertMessage(''), 2000);
    //   return;
    // }

    setStatus('loading')

    const formData = new FormData();
    formData.append('userId', selectedData.userId);
    formData.append('movieId', tmdbId);
    formData.append('description', selectedData.description);
    // formData.append('cast', file); // Use the state variable `file`
    formData.append('name', selectedData.name);
    formData.append('characterName', selectedData.characterName);
    formData.append('url', convertToEmbedUrl(selectedData.url));

    const data = {
      userId: selectedData.userId,
      movieId: tmdbId,
      description: selectedData.description,
      image: file
    }

    console.log(file)

    axios({
      method: 'post',
      url: '/casts',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setIsError(false);
        setAlertMessage(response.data?.message);
        setTimeout(() => {
          setAlertMessage('');
          setState('base')
        }, 2000);
      })
      .catch((error) => {
        console.log(error.response);
        setIsError(true);
        setAlertMessage(error.response?.data?.errors[0] || error.response?.data);
        setTimeout(() => setAlertMessage(''), 2000);
      });
  };

  const handleUpdate = async (event) => {
    // event.preventDefault();

    setStatus('loading')

    const formData = new FormData();
    formData.append('id', selectedData.id)
    formData.append('userId', selectedData.userId);
    formData.append('movieId', tmdbId);
    formData.append('description', selectedData.description);
    formData.append('url', selectedData.url);
    formData.append('name', selectedData.name);
    formData.append('characterName', selectedData.characterName);

    const data = {
      id: selectedData.id,
      userId: selectedData.userId,
      movieI: tmdbId,
      name: selectedData.name,
      characterName: selectedData.characterName,
      description: selectedData.description,
      url: selectedData.url
    }

    console.log(selectedData)

    axios({
      method: 'patch',
      url: `/casts/${selectedData.id}`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setIsError(false);
        setAlertMessage(response.data.message);
        
        setTimeout(() => {
          setAlertMessage('');
          setState('base')
        }, 2000);
      })
      .catch((error) => {
        console.log(error.response);
        setIsError(true);
        setAlertMessage(error.response?.data?.message);
        setTimeout(() => setAlertMessage(''), 2000);
      });
  };

  const handleDelete = () => {
    setStatus('loading')
    console.log(selectedData);
    console.log(selectedData.id);
    const isConfirmed = window.confirm('Are you sure you want to delete this cast?');
    if (isConfirmed) {
      axios({
        method: 'delete',
        url: `/casts/${selectedData.id}`,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
        .then((response) => {
          console.log('Database Updated');
          console.log(response.data);
          setIsError(false);
          setAlertMessage(response.data.message);
          setTimeout(() => {
            setAlertMessage('');
            setState('base');
          }, 2000);
        })
        .catch((error) => {
          console.log(error.data);
          setIsError(true);
          setAlertMessage(error.data.message);
          setTimeout(() => setAlertMessage(''), 2000);
        });
    }
  };

  return (
    <>
      {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
      <div className="cast-cards">
        <form>
          <div className="casts-details">
            <div className="field">
              Cast Profile Link
              <input
                type="text"
                name="url"
                value={selectedData.url}
                ref={urlRef}
                onChange={handleOnChange}
              />
              {debounceState && isFieldsDirty && (selectedData.url === '') && (<span className='errors'>This field is required</span>)}
              </div>
            <div className="field">
              Name
              <input
                type="text"
                name="name"
                value={selectedData.name}
                ref={nameRef}
                onChange={handleOnChange}
              />
              {debounceState && isFieldsDirty && (selectedData.name === '') && (<span className='errors'>This field is required</span>)}
            </div>
            <div className="field">
              Character Name
              <input
                type="text"
                name="characterName"
                value={selectedData.characterName}
                ref={characterNameRef}
                onChange={handleOnChange}
              />
              {debounceState && isFieldsDirty && (selectedData.characterName === '') && (<span className='errors'>This field is required</span>)}
            </div>
          </div>
          <div className="cast-profile">
            <img
                src={
                  selectedData.url && !selectedData.url.includes("null")
                    ? convertToEmbedUrl(selectedData.url)
                    : 'https://via.placeholder.com/550x300?text=No+cast'
                  }
                  alt={selectedData.name || 'Cast Image'} // Provide a meaningful alt text
                  className="cast-image"
                  allowFullScreen
                >
            </img>
          </div>
        </form>
      </div>
      <div className="button-group">
        {state === 'update' && <button onClick={handleDelete} className='delete-button'>Delete</button>}
        <button onClick={() => {
                  console.log(status);
                  if (status === 'loading') {
                    return;
                  }
                  const { url, name, characterName} = selectedData;
                  if (url && name && characterName) {
                    state === 'update' ? handleUpdate() : handleSave()
                  } else {
                    //fields are incomplete
                    setIsFieldsDirty(true);
                    //focus if field is empty!
                    if (!url) {
                      urlRef.current.focus();
                    } else if (!nameRef) {
                      nameRef.current.focus();
                    } else if (!characterNameRef) {
                      characterNameRef.current.focus();
                    }
                  }
                }}>Save</button>
      </div>
    </>
  );
}

export default Form;
