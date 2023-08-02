import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import newimg from './cornerlogobeta.png';
import axios from 'axios';

const Compcreation = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [keyError, setkeyError] = useState('')
    const navigate = useNavigate();
    const [CCname, setCompName] = useState('');
    const [CCkey, setCompPass] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(CCname)

        setErrorMessage('');
        setkeyError('');
  
        
        if (CCkey === '' || CCname === '') {
            setErrorMessage('Please fill in all fields.');
            return;
            }
        if (CCkey.length !== 4|| !/^\d+$/.test(CCkey)) {
            setkeyError('Organization Key must be 4 digits long and consist of only numbers.');
            return; // Exit the function early since the CCkey is not valid
          }

        
        try {
            const registrationData = JSON.parse(localStorage.getItem('registrationData'));
            const { name, accountType, email, password } = registrationData
            console.log('regdata', registrationData)
            const CalendarData = { name, CCname, accountType};
            localStorage.setItem('CalendarData', JSON.stringify(CalendarData));
            console.log('caldata', CalendarData)

            const formData = {
                name,
                accountType,
                email,
                password,
                CCname,
                CCkey
            };
            console.log('creation details', formData)
            const response = await axios.post('https://timesyncv2-a367bdb60782.herokuapp.com/api/cc-create', formData, {
              headers: {
                'Content-Type': 'application/json'
              }

            });

             // Handle the response or perform additional actions as needed
             console.log('creation fetched data', response.data);
             
             if (response.data.message === 'Data stored successfully'){
                navigate('/calendar')
             } else {
                console.log('reaches else')
                // If the response contains an error message, set the error state
                setErrorMessage('Company Name Not Available. Please Choose Another Name');
              }

        } catch (error) { 
            console.log('THIS IS THE ERROR:',error);
            setErrorMessage('Company Name Not Available. Please Choose Another Name');
        }

    }
    return (
        <div>
            <div>
                <img src={newimg} className='CC-sm-logo' alt="small-logo"/>
            </div>
            <div className='CCinfo'>
                <h4 className="other-larger-header2">Create Organization Credentials</h4>
                <form className='CompCreation-form' onSubmit={handleSubmit}>
                    <label htmlFor='email'>Organization:</label>
                    <input value={CCname} onChange={(e) => setCompName(e.target.value)} type="name" placeholder='Enter name here' id='email' name='email'/>
                    <label htmlFor='password'>Organization Key (4-digit PIN):</label>
                    <input value={CCkey} onChange={(e) => setCompPass(e.target.value)} type='password' placeholder='Enter password here' id='password' name='password'/>
                    {errorMessage && <p className='Create-CC-error'>{errorMessage}</p>}
                    {keyError && <p className='Create-CC-error'>{keyError}</p>}
                    <button className = 'logbutton' type='submit'>Create</button>
                </form>
            </div>
        </div>
        )

}

export default Compcreation