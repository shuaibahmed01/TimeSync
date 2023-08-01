import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import rightsideimg from './stockimage.jpeg';
import newimg from './cornerlogobeta.png';
import axios from 'axios';


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCalendar = (accountInfo) => {
        navigate('/calendar', { state: { accountInfo } });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email)
        setErrorMessage(''); // Clear previous error message

        if (email === '' || pass === '') {
            setErrorMessage('Please fill in all fields.');
            return;
          }
          
        try {
            const response = await axios.post('https://timesyncv2-a367bdb60782.herokuapp.com/login', {
              email: email,
              password: pass,
            });
        
            const data = response.data;
            console.log(data);
        
            if (data.account) {
              handleCalendar(data.account);
            } 
          } catch (error) {
            console.error(error);
            setErrorMessage('Invalid Credentials'); // Set error message for other errors
          }

    }

    return (
        <div className='split'>
            <div>
                <img src={newimg} className='sm-logo' alt="small-logo"/>
            </div>
            <div className='Login'>
                <h4 className="other-larger-header">Log In</h4>
                <form className='login-form' onSubmit={handleSubmit}>
                    <label htmlFor='email'>Email:</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Enter email here' id='email' name='email'/>
                    <label htmlFor='password'>Password:</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='Enter password here' id='password' name='password'/>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button className = 'logbutton' type='submit'>LOG IN</button>
                </form>
            </div>
            <div className='right-side'>
                <div className='rst-box'>
                    <div className='right-side-text'>Scheduling Made Easier.</div>
                </div>
                <img src={rightsideimg} className="stock" alt="stockimage" />
            </div>
        </div>
    )
}

export default Login;