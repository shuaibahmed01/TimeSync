import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import rightsideimg from './register_stock.jpeg';
import newimg from "./cornerlogobeta.png";


const Register = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordFormatError, setPasswordFormatError] = useState('');
    const [accountType, setAccountType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();


        setErrorMessage('');
        setPasswordError('');
        setPasswordFormatError('');
        
        if (name === '' || accountType === '' || email === '' || password === '') {
          setErrorMessage('Please fill in all fields.');
          return;
        }
    
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
          }
      
          // Use a regular expression to check if the password consists of only letters and numbers
          const passwordFormat = /^[a-zA-Z0-9]+$/;
          if (!password.match(passwordFormat)) {
            setPasswordFormatError('Password can only consist of letters and numbers.');
            return;
          }

        const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!email.match(emailFormat)) {
        setErrorMessage('Please enter a valid email address.');
        return;
        }
    
        // Email provider check (you can modify this list as needed)
        const validEmailProviders = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", '.edu', ".org"];
        const emailProvider = email.split("@")[1];
        if (!validEmailProviders.includes(emailProvider)) {
        setErrorMessage('Please use a valid email provider.');
        return;
        }

        const registrationData = { name, accountType, email, password };
        localStorage.setItem('registrationData', JSON.stringify(registrationData));


    
        if (accountType === 'Organizer') {
          navigate('/CCinfo');
        } else {
          navigate('/companysearch');
        }
      };
    

    return (
        <div className='split'>
            <div>
                <img src={newimg} className='sm-logo2' alt="small-logo"/>
            </div>
            <div className='Register'>
                <h2 className="larger-header" >Registration</h2>
                <form className='register-form' onSubmit={handleSubmit}>
                    <label htmlFor='name'>Enter Full Name:</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type='name' placeholder='Enter Full Name Here' id='name' name='name'/>
                    <label className='type-header'>Please Select Your Account Type:</label>
                    <label htmlFor="client" className="light">
                        <input
                            className='option-bubble'
                            type="radio"
                            id="client"
                            value="Client"
                            name="account_type"
                            checked={accountType === 'Client'} 
                            onChange={() => setAccountType('Client')}
                        />
                        <span className="label-text">Client</span>
                    </label>
                    <label className='option2' htmlFor="organizer">
                        <input
                            className='option-bubble'
                            type="radio"
                            id="organizer"
                            value="Organizer"
                            name="account_type"
                            checked={accountType === 'Organizer'}
                            onChange={() => setAccountType('Organizer')} 
                        />
                        <span className="label-text">Organizer</span>
                    </label>
                    <label htmlFor='email'>Enter Email:</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Enter email here' id='email' name='email'/>
                    <label htmlFor='password'>Enter Password:</label>
                    <input value={password} onChange={(e) => setPass(e.target.value)} type='password' placeholder='Enter password here' id='password' name='password'/>
                    {passwordError && <p className='error5'>{passwordError}</p>}
                    {passwordFormatError && <p className='error5'>{passwordFormatError}</p>}
                    {errorMessage && <p className='error5'>{errorMessage}</p>}
                    <button type='submit' className='register-button'>Register</button>
                </form>
            </div>
            <div className='right-side2'>
                <img src={rightsideimg} className="stock2" alt="stockimage" />
                <div className='rst-box2'>
                    <div className='right-side-text'>Get Started Now!</div>
                </div>
            </div>
        </div>

    )
}





export default Register;