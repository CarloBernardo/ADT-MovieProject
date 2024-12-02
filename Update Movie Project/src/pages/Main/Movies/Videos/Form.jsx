import React, { useContext, useEffect, useRef, useState } from 'react'
import './Videos.css'
import { useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import { AuthContext } from '../../../../../context/context';
import axios from 'axios';

function Form({ data, state, setState }) {
  const { auth } = useContext(AuthContext);
  let { tmdbId, movieId } = useParams();

  const [selectedData, setSelectedData] = useState(data);
  const [file, setFile] = useState(null); // Use state to manage the file
  const urlRef = useRef();
  const descriptionRef = useRef();

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

    const videoIdMatch = youtubeUrl.match(/v=([^&]+)/);

    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1];

      return `https://www.youtube.com/embed/${videoId}`;
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
    // formData.append('video', file); // Use the state variable `file`
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
      url: '/videos',
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
    

    const data = {
      id: selectedData.id,
      userId: selectedData.userId,
      movieI: tmdbId,
      description: selectedData.description,
      image: file
    }

    console.log(selectedData)

    axios({
      method: 'patch',
      url: `/videos/${selectedData.id}`,
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
    const isConfirmed = window.confirm('Are you sure you want to delete this Video?');
    if (isConfirmed) {
      axios({
        method: 'delete',
        url: `/videos/${selectedData.id}`,
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
      <div className="video-cards">
        <form>
          <div className="videos-details">
            <div className="field">
              Video
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
              Description
              <textarea
                rows={5}
                type="text"
                name="description"
                value={selectedData.description}
                ref={descriptionRef}
                onChange={handleOnChange}
              />
              {debounceState && isFieldsDirty && (selectedData.description == '') && (<span className='errors'>This field is required</span>)}
            </div>
          </div>
          <div className="video-profile">
            <iframe
                src={
                  selectedData.url && !selectedData.url.includes("null")
                    ? convertToEmbedUrl(selectedData.url)
                    : 'https://via.placeholder.com/550x300?text=No+Video'
                  }
                  className="video-frame"
                  allowFullScreen
                >
            </iframe>
          </div>
        </form>
      </div>
      <div className="button-group">
        {state == 'update' && <button onClick={handleDelete} className='delete-button'>Delete</button>}
        <button onClick={() => {
                  if (status === 'loading') {
                    return;
                  }
                  const { url, description} = selectedData;
                  if (url && description) {
                    state === 'update' ? handleUpdate() : handleSave()
                  } else {
                    //fields are incomplete
                    setIsFieldsDirty(true);
                    //focus if field is empty
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
