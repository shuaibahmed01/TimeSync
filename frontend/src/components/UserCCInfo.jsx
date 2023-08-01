import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import newimg from './cornerlogobeta.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserCCInfo = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [CCname, setCCname] = useState('');
    const [CCkey, setCCkey] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        // navigate('/calendar')
        // console.log(ODemail)

        setErrorMessage('')

        if (CCkey === '' || CCname === '') {
            setErrorMessage('Please fill in all fields.');
            return;
            }
    
        
        try {
            const registrationData = JSON.parse(localStorage.getItem('registrationData'));
            const { name, accountType, email, password } = registrationData

            const CalendarData = { name, CCname, accountType };
            localStorage.setItem('CalendarData', JSON.stringify(CalendarData));

            const formData = {
                name,
                accountType,
                email,
                password,
                CCname,
                CCkey
            };

            const response = await axios.post('https://timesyncv2-a367bdb60782.herokuapp.com/api/cc-data', formData, {
              headers: {
                'Content-Type': 'application/json'
              }

            });

             // Handle the response or perform additional actions as needed
             console.log(response.data.message);
             
             if (response.data.message === 'Data stored successfully'){
                navigate('/calendar')
             } else {
                console.log('reaches else')
                // If the response contains an error message, set the error state
                setErrorMessage('Invalid Credentials. Please Try Again');
              }

        } catch (error) { 
            console.log('Is is in the catch');
            setErrorMessage('Invalid Credentials. Please Try Again');
        }

    }
    return (
        <div>
            <div>
                <img src={newimg} className='CC-sm-logo' alt="small-logo"/>
            </div>
            <div className='CCinfo'>
                <h4 className="other-larger-header2">Please Enter Organization Credentials</h4>
                <form className='login-form2' onSubmit={handleSubmit}>
                    <label htmlFor='email'>Organization Name:</label>
                    <input value={CCname} onChange={(e) => setCCname(e.target.value)} type='name' placeholder='Enter name here' />
                    <label htmlFor='password'>Organization Key:</label>
                    <input value={CCkey} onChange={(e) => setCCkey(e.target.value)} type='password' placeholder='Enter key here' id='password' name='password'/>
                    {errorMessage && <p className="User-CC-error">{errorMessage}</p>}
                    <button className = 'logbutton' type='submit'>Join</button>
                </form>
                <Link className='link-to-creation' to='/Compcreation'>Click Here to Create Organization!</Link>
            </div>
        </div>
        )

}

export default UserCCInfo