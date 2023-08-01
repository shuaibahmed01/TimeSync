import { useLocation } from 'react-router-dom';
import { useEffect, useState} from 'react'
import axios from 'axios';
import { format } from 'date-fns';

const SideMenu = () => {
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]); 
  const [currentmaxAppointments, setCurrentMaxAppointments] = useState(3); // Declare currentmaxAppointments state
  const [orgStartTime, setOrgStartTime] = useState('');
  const [orgEndTime, setOrgEndTime] = useState('');

   /* Code to receive correct display names from Register info*/ 
   const [dispname, setdispname] = useState('')
   const CalendarData = JSON.parse(localStorage.getItem('CalendarData'));
   const { name, CCname, accountType} = CalendarData

   
   const [maxAppointments, setMaxAppointments] = useState(3);
   const [showPopup, setShowPopup] = useState(false);
 
 
   /* Receiving Log in info*/ 
   const location = useLocation();
   const [accountInfo, setAccountInfo] = useState(null);
 
   useEffect(() => {
     if (location.state && location.state.accountInfo) {
       setAccountInfo(location.state.accountInfo);
     } 
   }, [location]);
   
  //  const convertTo24HourFormat = (timeStr) => {
  //   let [time, meridian] = timeStr.split(' ');
  //   let [hours, minutes] = time.split(':');
  
  //   if (meridian === 'PM' || meridian === 'pm') {
  //     hours = parseInt(hours) + 12;
  //   }
  
  //   if (meridian === 'AM' || meridian === 'am') {
  //     if (hours === '12') {
  //       hours = '00';
  //     }
  //   }
  //   return `${hours}:${minutes}`;
  // }
   /* set displayname */
   useEffect(() => {
     if (accountInfo) {
       setdispname(accountInfo.name)
     } else if (CalendarData) {
       setdispname(name)
     }
   }, [name, accountInfo, CalendarData]);

    let newvariable;
    if (accountInfo && accountInfo.company !== null) {
      newvariable = accountInfo.company;
    } else {
      newvariable = CCname;
    }



   useEffect(() => {
    console.log('SIDEMENU FETCH (IN USE EFFECT')
    const fetchData = async () => {
      console.log('SIDEMENU FETCH DATA CALLED (BEFORE TRY)')
      try {
        console.log('SIDEMENU FETCHDATA CALLED')
        const response = await axios.get('https://timesyncv2-a367bdb60782.herokuapp.com/api/fetch-data', {
          params: {
            tableName: newvariable,
          },
        });
        let data = response.data;

        console.log('DATAsm:',data)
        // Check if 'maxAppt' is present in the data response
        console.log('IN THE FUNCTIONsm')

        
        // Extract the 'maxAppt' value from the data
        const maxApptValue = data.pop()
        console.log('maxAPPTVALUEsm:', maxApptValue)
        // Use setMaxAppointments to update the state with the 'maxAppt' value
        console.log(maxApptValue.maxAppt)
        const placeholder = maxApptValue.maxAppt
        setCurrentMaxAppointments(placeholder);
        console.log('AFTER SETsm:', maxAppointments)


        


        setAppointments(data)
        

        
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [accountInfo, maxAppointments, newvariable]);

  


  const toggleAppointments = () => {
    setShowAppointments(!showAppointments);
  };

  function convertToMeridianTime(time) {
    const [hours, minutes] = time.split(':');
    let meridian = 'AM';
  
    let hour = parseInt(hours);
    if (hour === 0) {
      hour = 12;
    } else if (hour === 12) {
      meridian = 'PM';
    } else if (hour > 12) {
      hour -= 12;
      meridian = 'PM';
    }
  
    return `${hour}:${minutes} ${meridian}`;
  }
  
  const getAbbreviatedName = (fullName) => {
    const [firstName, lastName] = fullName.split(' ');
  
    if (lastName) {
      return `${firstName} ${lastName.charAt(0)}.`;
    } else {
      return firstName;
    }
  };

  // Get the current date
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  

  let newvariable2;
    if (accountInfo && accountInfo.accountType !== null) {
      newvariable2 = accountInfo.accountType;
    } else {
      newvariable2 = accountType;
    }

  // Filter appointments for the current day
  const currentDayAppointments = appointments.filter(
    (appointment) =>
      appointment.date === currentDate && ((newvariable2 === 'Client') ? appointment.title === dispname : true)
  );
  
  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleMaxAppointmentsChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxAppointments(value);
  };

  const saveMaxAppointments = () => {
    axios
      .put('https://timesyncv2-a367bdb60782.herokuapp.com/api/update-max-appointments', {
        ccname: newvariable, // Pass the value of newvariable as ccname
        maxAppointments: maxAppointments, // Pass the value of maxAppointments
        orgStartTime: orgStartTime, // Pass the value of orgStartTime
        orgEndTime: orgEndTime, // Pass the value of orgEndTime
      })
      .then(response => {
        console.log(response.data); // Log the response
        // Handle the response as needed
      })
      .catch(error => {
        console.error(error); // Log the error
        // Show an error message or perform other error handling
      });
  
    closePopup();
  };


  return (
    <div className="side-menu">
      <div className='side-title'>
        <h2 className='sideHeader2'>Welcome, </h2>
        <h2 className='sideHeader'>{dispname}</h2>
      </div>     
      <button className = 'side-button' onClick={toggleAppointments}>
        {showAppointments ? "Hide Today's Appointments" : "Show Today's Appointments"}
      </button>
      {showAppointments && (
        <div className="appt-list-container">
          <ul className="appt-list">
            {currentDayAppointments.map(appointment => (
              <li className="appt-item" key={appointment.id}>
                <div className="appt-item-box">
                  <span className="appt-item-title">{getAbbreviatedName(appointment.title)} - </span>
                  <span className="appt-item-time">{convertToMeridianTime(appointment.start_time)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {newvariable2 === 'Organizer' ? (
        <button className='sb-text' onClick={openPopup}>
          <span>Appointment Settings</span>
        </button>
      ) : (
        <div className='appoint-info'>
          <span>Note: Max Appointments Per Hour is {currentmaxAppointments}</span>
        </div>
      )}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className='max-appt-header'>Appointment Settings</h2>
            <div className='max-appt-wrapper'>
              <div className='max-1'>
                <div className="option">
                  <label htmlFor="maxAppointments">Max Appointments Per Hour:</label>
                  <input
                    type="number"
                    id="maxAppointments"
                    value={maxAppointments}
                    onChange={handleMaxAppointmentsChange}
                  />
                </div>
                <div className="option">
                  <label htmlFor="orgStartTime">Organization Start Time:</label>
                  <input
                    type="time"
                    id="orgStartTime"
                    value={orgStartTime}
                    onChange={(e) => setOrgStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className='max-2'>
                <div className="option">
                  <label htmlFor="orgEndTime">Organization End Time:</label>
                  <input
                    type="time"
                    id="orgEndTime"
                    value={orgEndTime}
                    onChange={(e) => setOrgEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="buttons9">
                <button className="popup-button" onClick={saveMaxAppointments}>
                  Save
                </button>
                <button className="popup-button" onClick={closePopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SideMenu;
