import React, { useContext, useEffect, useRef, useState } from 'react'
import './Photos.css'
import { useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { AuthContext } from '../../../../context/context.js';
import axios from 'axios';

function Form({ data, state, setState }) {
  const { auth } = useContext(AuthContext);
  let { tmdbId, movieId } = useParams();

  const [selectedData, setSelectedData] = useState(data);
  const [file, setFile] = useState(null); 
  const fileRef = useRef();
  const descriptionRef = useRef();
  const urlRef = useRef();

  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();
  const userInputDebounce = useDebounce({ selectedData }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);

  
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setSelectedData(data);
  }, [data]);

 
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);  
    console.log(uploadedFile); 
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

  
    useEffect(() => {
      setDebounceState(true);
    }, [userInputDebounce]);

  const handleSave = async (event) => {
    const formData = new FormData();
    formData.append('userId', selectedData.userId);
    formData.append('movieId', tmdbId);
    formData.append('description', selectedData.description);
    formData.append('url', selectedData.url)

    const data = {
      userId: selectedData.userId,
      movieId: tmdbId,
      description: selectedData.description,
      image: file
    }


    axios({
      method: 'post',
      url: '/photos',
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
        setAlertMessage(error.response?.data?.errors[0]);
        setTimeout(() => setAlertMessage(''), 2000);
      });
  };

  const handleUpdate = async (event) => {
    const formData = new FormData();
    formData.append('id', selectedData.id)
    formData.append('userId', selectedData.userId);
    formData.append('movieId', tmdbId);
    formData.append('description', selectedData.description);
    formData.append('url', selectedData.url);

    const data = {
      id: selectedData.id,
      userId: selectedData.userId,
      movieI: tmdbId,
      description: selectedData.description,
      image: file
    }

    axios({
      method: 'patch',
      url: `/photos/${selectedData.id}`,
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
    console.log(selectedData);
    console.log(selectedData.id);
    setStatus('loading')
    const isConfirmed = window.confirm('Are you sure you want to delete this photo?');
    if (isConfirmed) {
      axios({
        method: 'delete',
        url: `/photos/${selectedData.id}`,
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
      {alertMessage && (
        <div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>
      )}
      <div className="photo-cards">
        <form>
          <div className="photos-details">
              
            <div className="field">
              Image
              <input
                type="text"
                name="url"
                ref={urlRef}
                onChange={handleOnChange}
                value={selectedData.url}
                
              />
              
              {debounceState && isFieldsDirty && (selectedData.url === '') && (<span className='errors'>This field is required</span>)}
              
              </div>
            <div className="field">
              Description
              <textarea
                rows={5}
                type="text"
                name="description"
                value={selectedData.description}
                ref={descriptionRef}
                onChange={handleOnChange}
              />
              {debounceState && isFieldsDirty && (selectedData.description === '') && (<span className='errors'>This field is required</span>)}
            </div>
          </div>
          <div className="photo-profile">
            <img
              src={
                selectedData.url && !selectedData.url.includes('null')
                  ? selectedData.url
                  : 'https://via.placeholder.com/700x400?text=No+Image'
              }
              alt={selectedData.description}
              className="photo-image"
            />
          </div>
        </form>
      </div>
      <div className="button-group">
        {state === 'update' && <button onClick={handleDelete} className='delete-button'>Delete</button>}
        <button onClick={() => {
                  if (status === 'loading') {
                    return;
                  }
                  const { url, description} = selectedData;
                  if (url && description) {
                    state === 'update' ? handleUpdate() : handleSave()
                  } else {
                    
                    setIsFieldsDirty(true);
                    
                    if (!url) {
                      urlRef.current.focus();
                    } else if (!description) {
                      descriptionRef.current.focus();
                    }
                  }
                }}>Save</button>
      </div>
    </>
  );
}

export default Form;
