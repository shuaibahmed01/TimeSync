import React, { useCallback, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import SideMenu from './Sidemenu';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


const CalendarPage = () => {
  const navigate = useNavigate();
  const [newEvents, setNewEvents] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [appointmentCounts, setAppointmentCounts] = useState({});
  const [maxAppointments, setMaxAppointments] = useState(0);
  const [formError, setFormError] = useState('');
  const [ReformError, setReformError] = useState('');

  /* Code to receive correct display names from Register info */
  const [dispname, setdispname] = useState('');
  const CalendarData = JSON.parse(localStorage.getItem('CalendarData'));
  const { name, CCname, accountType } = CalendarData;
  

  /* Receiving Log in info */
  const location = useLocation();
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    if (location.state && location.state.accountInfo) {
      setAccountInfo(location.state.accountInfo);
    }
  }, [location, navigate]);

  /* set displayname */
  useEffect(() => {
    if (accountInfo) {
      setdispname(accountInfo.company);
    } else if (CalendarData) {
      setdispname(CCname);
    }
  }, [name, accountInfo, CalendarData, CCname]);
  

  const getEventColor = useCallback((event) => {
    if (!event.title) return 'gray';
    if (accountInfo?.accountType === 'Organizer') {
      return 'matt lightblue';
    } else if (accountInfo?.accountType === 'Client' && event.title === accountInfo?.name) {
      return 'matt lightblue';
    } else if (accountInfo?.accountType === 'Client' && event.title !== accountInfo?.name) {
      return 'gray';
    } else if (accountType === 'Organizer') {
      return 'matt lightblue';
    } else if (accountType === 'Client' && event.title === name) {
      return 'matt lightblue';
    } else {
      return 'gray';
    }
  }, [accountInfo, name, accountType]);
  
 
  useEffect(() => {
    console.log('CALENDAR FETCH (IN USE EFFECT')
    const fetchData = async () => {
      console.log('CALENDAR FETCH DATA CALLED (BEFORE TRY')
      try {
        console.log('CALENDAR FETCH DATA CALLED')
        if (dispname) {
          console.log('dispname condition triggered')
          const response = await axios.get('https://timesyncv2-a367bdb60782.herokuapp.com/api/fetch-data', {
            params: {
              tableName: dispname,
            },
          });
          let data = response.data;

          console.log('DATA:',data)
          // Check if 'maxAppt' is present in the data response
          console.log('IN THE FUNCTION')

          
          // Extract the 'maxAppt' value from the data
          const maxApptValue = data.pop()
          console.log('maxAPPTVALUE:', maxApptValue)
          // Use setMaxAppointments to update the state with the 'maxAppt' value
          console.log(maxApptValue.maxAppt)
          const placeholder = maxApptValue.maxAppt
          console.log("PLACEHOLDER:", placeholder)
          setMaxAppointments(placeholder);
          console.log('AFTER SET:', maxAppointments)
          // Remove the 'maxAppt' entry from the 'data' object
          
     
          console.log(maxAppointments)
          console.log('NEW DATA:',data)

          // Calculate appointment counts for each time slot
          const counts = {};
          data.forEach((event) => {
            const startTime = convertTo24HourFormat(event.start_time);
            const date = event.date;
            if (!counts[startTime]) {
              counts[startTime] = { [date]: 1 };
            } else {
              counts[startTime][date] = (counts[startTime][date] || 0) + 1;
            }
          });
          setAppointmentCounts(counts);


          const events = data.map((event) => {
            const eventColor = getEventColor(event);

            let newEvent = {
              title: event.title,
              start: `${event.date}T${event.start_time}:00`,
              end: `${event.date}T${event.end_time}:00`,
              color: eventColor

              // Add other properties as needed
            };
            

            let eventCheck = false
            if ((accountInfo?.accountType === 'Organizer') && eventCheck === false) {
              console.log('orgtype')
              newEvent.title = event.title;
              
              eventCheck = true
            }
            if ((accountInfo?.accountType === 'Client') && eventCheck === false) {
              console.log('clienttype')
              console.log(accountInfo?.name)
              if ((event.title === accountInfo?.name)) {
                newEvent.title = event.title;
              } else {
                newEvent.title = '';
              }
              eventCheck = true
            }
            if ((accountType === 'Organizer') && eventCheck === false) {
              console.log('orgtype')
              newEvent.title = event.title;
         
              eventCheck = true
            }
            if ((accountType === 'Client') && eventCheck === false) {
              console.log('clienttype')
              console.log(name, accountInfo)
              if ((event.title === name)) {
                console.log(event.title)
                newEvent.title = event.title;
              } else {
                newEvent.title = '';
                console.log('blank event')
              }
            }

            return newEvent;
          });

          

          setNewEvents(events);
          
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispname, accountInfo, maxAppointments, accountType, name, getEventColor]);

  // useEffect(() => {
  //   console.log('MAX APPOINTMENTS CHANGED:', maxAppointments);
  //   // Do anything else you need to do with the updated maxAppointments value
  // }, [maxAppointments]);

  /* Handles Sign Out */
  const handleSignOut = () => {
    navigate('/');
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: '',
    time: '',
    date: '',
    otherDetails: '',
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isReschedulePopupOpen, setIsReschedulePopupOpen] = useState(false);
  const [rescheduleDetails, setRescheduleDetails] = useState({
    name: '',
    date: '',
    start_time: '',
    end_time: '',
  });

  /*Appointment Creation*/
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };


  const convertTo24HourFormat = (timeStr) => {
    let [time, meridian] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
  
    if (meridian === 'PM' || meridian === 'pm') {
      hours = parseInt(hours) + 12;
    }
  
    if (meridian === 'AM' || meridian === 'am') {
      if (hours === '12') {
        hours = '00';
      }
    }
  
    return `${hours}:${minutes}`;
  };

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm)$/;

  const handleAppointmentSubmission = async () => {

    setErrorMessage('');
    setFormError('');

    // Check if all form fields are filled
    if (!appointmentDetails.name || !appointmentDetails.date || !appointmentDetails.start_time || !appointmentDetails.end_time) {
      setFormError('Please fill out all the required fields.');
    return;
    }
  
    // Validate the date format
    if (!dateRegex.test(appointmentDetails.date)) {
      setFormError('Please enter a valid date in the format YYYY-MM-DD.');
      return;
    }

    // Validate the start time format
    if (!timeRegex.test(appointmentDetails.start_time)) {
      setFormError('Please enter a valid start time in the format HH:MM AM/PM.');
      return;
    }

    // Validate the end time format
    if (!timeRegex.test(appointmentDetails.end_time)) {
      setFormError('Please enter a valid end time in the format HH:MM AM/PM.');
      return;
    }


    if ((appointmentDetails.start_time.slice(3,5) !== '30') && (appointmentDetails.start_time.slice(3,5) !== '00')) {
      setFormError('Keep Appointments on Every Half Hour. Please Choose Another Time.')
      return;
    }

    if ((appointmentDetails.end_time.slice(3,5) !== '30') && (appointmentDetails.end_time.slice(3,5) !== '00')) {
      setFormError('Keep Appointments on Every Half Hour. Please Choose Another Time.')
      return;
    }

    const formData2 = {
      start_time: appointmentDetails.start_time,
      end_time: appointmentDetails.end_time,
      dispname: dispname,
    };

    console.log('FORMDATA2:',formData2)

    const hourResponse = await axios.post('https://timesyncv2-a367bdb60782.herokuapp.com/api/hour-check', formData2, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const isWithinBusinessHours = hourResponse.data.result;

    if (!(isWithinBusinessHours)){
      setFormError('Appointment Not Within Company Hours. Please Choose Another Time');
      return;
    }

    // Check if the time slot has reached the limit of 3 appointments
    const startTime = convertTo24HourFormat(appointmentDetails.start_time);
    const selectedDate = appointmentDetails.date;
    console.log(maxAppointments);
    console.log(appointmentCounts[startTime])
    const currentCount = appointmentCounts[startTime]?.[selectedDate] || 0;
    console.log('CURRENT COUNT:', currentCount)
  // Check if the current count exceeds the maximum allowed appointments
    if (maxAppointments === 1){
      if (currentCount >= 1) {
        setErrorMessage('The selected time slot is already booked. Please choose another time.');
        return;
      }
    }

    if (currentCount >= maxAppointments) {
      setErrorMessage('The selected time slot is full. Please choose another time.');
      return;
    }


    if (appointmentDetails.start_time.includes('PM') || appointmentDetails.start_time.includes('pm')) {
      const hour = parseInt(appointmentDetails.start_time.split(':')[0]);
      if (hour !== 12) {
        appointmentDetails.start_time = `${hour + 12}:${appointmentDetails.start_time.split(':')[1]}`;
      }
    } else if (appointmentDetails.start_time.includes('AM') || appointmentDetails.start_time.includes('am')) {
      const hour = parseInt(appointmentDetails.start_time.split(':')[0]);
      if (hour === 12) {
        appointmentDetails.start_time = `00:${appointmentDetails.start_time.split(':')[1]}`;
      }
    }
  
    if (appointmentDetails.end_time.includes('PM') || appointmentDetails.end_time.includes('pm')) {
      const hour = parseInt(appointmentDetails.end_time.split(':')[0]);
      if (hour !== 12) {
        appointmentDetails.end_time = `${hour + 12}:${appointmentDetails.end_time.split(':')[1]}`;
      }
    } else if (appointmentDetails.end_time.includes('AM') || appointmentDetails.end_time.includes('am')) {
      const hour = parseInt(appointmentDetails.end_time.split(':')[0]);
      if (hour === 12) {
        appointmentDetails.end_time = `00:${appointmentDetails.end_time.split(':')[1]}`;
      }
    }
    
    const newEvent = {
      title: appointmentDetails.name,
      start: `${appointmentDetails.date}T${appointmentDetails.start_time.slice(0,5)}:00`,
      end: `${appointmentDetails.date}T${appointmentDetails.end_time.slice(0,5)}:00`,
      // Add other properties as needed
    };

    try {
      const formData = {
        client_name: appointmentDetails.name,
        date: appointmentDetails.date,
        start_time: appointmentDetails.start_time,
        end_time: appointmentDetails.end_time,
        dispname: dispname,
      };

        await axios.post('https://timesyncv2-a367bdb60782.herokuapp.com/api/appt-create', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update the appointment count for the time slot
      setAppointmentCounts((prevCounts) => ({
        ...prevCounts,
        [startTime]: {
          ...prevCounts[startTime],
          [selectedDate]: currentCount + 1,
        },
      }));

      window.location.reload();
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occured. Please Try Again');
    }

    setNewEvents((prevEvents) => [...(prevEvents || []), newEvent]);

    closePopup();

  
  };

  const handleEventClick = (clickInfo) => {
    const clickedEvent = clickInfo.event;
  // Check if the event title is not empty
    if (clickedEvent.title !== '') {
      setSelectedEvent(clickedEvent);
      setShowPopup(true);
    }
  };

  const handleCancelAppointment = async () => {
    if (isReschedulePopupOpen) {
      setIsReschedulePopupOpen(false);
    }

    try {
      // Logic to cancel the appointment
      // You can access the selected event using the selectedEvent state variable
  
      // Close the popup
      setShowPopup(false);
  
      // Prepare the data to send in the request payload
      const requestData = {
        table: dispname.replace(' ', '_').toLowerCase(), // Modify table name to match backend logic
        title: selectedEvent.title,
        date: selectedEvent.start.toISOString().split('T')[0],
        start_time: selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

        // Check if the start time is in PM and convert it to military format
      const startHour = parseInt(selectedEvent.start.getHours());
      if (startHour > 12) {
        requestData.start_time = requestData.start_time.replace((requestData.start_time.slice(0,2)), (((Number(requestData.start_time.slice(0,2))) + 12).toString()));
      }

      
  
      // Make the API request to delete the appointment
      await axios.delete('https://timesyncv2-a367bdb60782.herokuapp.com/api/delete-appt', { data: requestData });
      
      const startTime = convertTo24HourFormat(selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const selectedDate = selectedEvent.start.toISOString().split('T')[0];
      setAppointmentCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        if (updatedCounts[startTime] && updatedCounts[startTime][selectedDate]) {
          updatedCounts[startTime][selectedDate]--;
        }
        return updatedCounts;
      });

      // Handle the response or perform additional actions as needed
  

      
      window.location.reload();
  
      // Refresh the page or update the event list in any way necessary
    } catch (error) {
      console.log(error);
      // Handle the error condition
    }

  };

  const handleRescheduleAppointment = () => {
    if (selectedEvent) {
      setIsReschedulePopupOpen(true);
      setShowPopup(false); // Close the previous pop-up
    }
  };


  const handleRescheduleSubmission = async () => {

    setErrorMessage('');
    setReformError('');
    
    if (!rescheduleDetails.name || !rescheduleDetails.date || !rescheduleDetails.start_time || !rescheduleDetails.end_time) {
      setReformError('Please fill out all the required fields.');
      return;
    }

    // Validate the date format
    if (!dateRegex.test(rescheduleDetails.date)) {
      setReformError('Please enter a valid date in the format YYYY-MM-DD.');
      return;
    }

    // Validate the start time format
    if (!timeRegex.test(rescheduleDetails.start_time)) {
      setReformError('Please enter a valid start time in the format HH:MM AM/PM.');
      return;
    }

    // Validate the end time format
    if (!timeRegex.test(rescheduleDetails.end_time)) {
      setReformError('Please enter a valid end time in the format HH:MM AM/PM.');
      return;
    }

    if ((rescheduleDetails.start_time.slice(3,5) !== '30') && (rescheduleDetails.start_time.slice(3,5) !== '00')) {
      setReformError('Keep Appointments on Every Half Hour. Please Choose Another Time.')
      return;
    }

    if ((rescheduleDetails.end_time.slice(3,5) !== '30') && (rescheduleDetails.end_time.slice(3,5) !== '00')) {
      setReformError('Keep Appointments on Every Half Hour. Please Choose Another Time.')
      return;
    }

    const formData3 = {
      start_time: rescheduleDetails.start_time,
      end_time: rescheduleDetails.end_time,
      dispname: dispname,
    };

    const hourResponse2 = await axios.post('https://timesyncv2-a367bdb60782.herokuapp.com/api/hour-check', formData3, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const isWithinBusinessHours2 = hourResponse2.data.result;

    if (!(isWithinBusinessHours2)){
      setReformError('Appointment Not Within Company Hours. Please Choose Another Time');
      return;
    }

    // Check if the time slot has reached the limit of 3 appointments
    const newStartTime = convertTo24HourFormat(rescheduleDetails.start_time)
    const newSelectedDate = rescheduleDetails.date;

    if (maxAppointments === 1){
      if (appointmentCounts[newStartTime] && appointmentCounts[newStartTime][newSelectedDate] >= 1) {
        setErrorMessage('The selected time slot is already booked. Please choose another time.');
        return;
      }
    }

    if (appointmentCounts[newStartTime] && appointmentCounts[newStartTime][newSelectedDate] >= maxAppointments) {
      setErrorMessage('The selected time slot is full. Please choose another time.');
      return;
    }

    if (rescheduleDetails.start_time.includes('PM') || rescheduleDetails.start_time.includes('pm')) {
      const hour = parseInt(rescheduleDetails.start_time.split(':')[0]);
      if (hour !== 12) {
        rescheduleDetails.start_time = `${hour + 12}:${rescheduleDetails.start_time.split(':')[1]}`;
      }
    } else if (rescheduleDetails.start_time.includes('AM') || rescheduleDetails.start_time.includes('am')) {
      const hour = parseInt(rescheduleDetails.start_time.split(':')[0]);
      if (hour === 12) {
        rescheduleDetails.start_time = `00:${rescheduleDetails.start_time.split(':')[1]}`;
      }
    }
  
    if (rescheduleDetails.end_time.includes('PM') || rescheduleDetails.end_time.includes('pm')) {
      const hour = parseInt(rescheduleDetails.end_time.split(':')[0]);
      if (hour !== 12) {
        rescheduleDetails.end_time = `${hour + 12}:${rescheduleDetails.end_time.split(':')[1]}`;
      }
    } else if (rescheduleDetails.end_time.includes('AM') || rescheduleDetails.end_time.includes('am')) {
      const hour = parseInt(rescheduleDetails.end_time.split(':')[0]);
      if (hour === 12) {
        rescheduleDetails.end_time = `00:${rescheduleDetails.end_time.split(':')[1]}`;
      }
    }

    try {

      const newData = {
        dispname: dispname,
        client_name: rescheduleDetails.name,
        date: rescheduleDetails.date,
        start_time: rescheduleDetails.start_time,
        end_time: rescheduleDetails.end_time,
      };
  
      // Delete the current event from the backend
      const requestData = {
        table: dispname.replace(' ', '_').toLowerCase(),
        title: selectedEvent.title,
        date: selectedEvent.start.toISOString().split('T')[0],
        start_time: selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      

        // Check if the start time is in PM and convert it to military format
      const startHour = parseInt(selectedEvent.start.getHours());
      if (startHour > 12) {
        requestData.start_time = requestData.start_time.replace((requestData.start_time.slice(0,2)), (((Number(requestData.start_time.slice(0,2))) + 12).toString()));
      }

      await axios.delete('https://timesyncv2-a367bdb60782.herokuapp.com/api/delete-appt', { data: requestData });

      const oldStartTime = convertTo24HourFormat(selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const oldSelectedDate = selectedEvent.start.toISOString().split('T')[0];
      setAppointmentCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        if (updatedCounts[oldStartTime] && updatedCounts[oldStartTime][oldSelectedDate]) {
          updatedCounts[oldStartTime][oldSelectedDate]--;
        }
        return updatedCounts;
      });

      
      await axios.post('https://timesyncv2-a367bdb60782.herokuapp.com/api/appt-create', newData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Update the appointment count for the time slot

      const newStartTime = convertTo24HourFormat(rescheduleDetails.start_time);
      const newSelectedDate = rescheduleDetails.date;
      setAppointmentCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        if (!updatedCounts[newStartTime]) {
          updatedCounts[newStartTime] = {};
        }
        updatedCounts[newStartTime][newSelectedDate] = (updatedCounts[newStartTime][newSelectedDate] || 0) + 1;
        return updatedCounts;
      });
      setIsReschedulePopupOpen(false); // Close the reschedule pop-up
      window.location.reload();

      // Handle the response or perform additional actions as needed
    } catch (error) {
      console.log(error);
      // Handle the error condition
    }
    

  };


  return (
    <div className='entire-screen'>
      <div className='page-container'>
        <div className='side-menu-container'>
        <SideMenu/> 
        </div>
        <div className='RightSideScreen'>
          <div className='sign-out-div'>
            <button className='sign-out-button' onClick={handleSignOut} type='submit'>
              <span className='button-text'>Sign Out</span>
            </button>
          </div>
          <h2 className='calendar-title'>{dispname}'s Schedule</h2>
          <div className='calendar-container'>
            <FullCalendar 
            plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
            initialView={'timeGridWeek'}
            headerToolbar={
                {start: "prev,next",
                center: 'title',
                end: "dayGridMonth,timeGridWeek,timeGridDay"}
            }
            allDaySlot = {false}
            events={newEvents} // Use newEvent in the events prop
            eventClick={handleEventClick}
          />
          </div>
          <button className='create-appt' onClick={openPopup} type='submit'>
            <span className='button-text'>Create Appointment</span>
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <div className='popup-overlay'>
          <div className='popup'>
            <h2>Create Appointment</h2>
            <form className='create-appt-form'>
              <label htmlFor='name'>Name:</label>
              <input
                type='text'
                id='name'
                name='name'
                value={appointmentDetails.name}
                onChange={handleInputChange}
              />
              <label htmlFor='date'>Enter Date:</label>
              <input
                type='text'
                id='date'
                name='date'
                value={appointmentDetails.date}
                placeholder='YYYY-MM-DD'
                onChange={handleInputChange}
              />
              <label htmlFor='start-time'>Enter Start Time:</label>
              <input
                type='text'
                id='start_time'
                name='start_time'
                value={appointmentDetails.start_time}
                placeholder='HH:MM AM/PM'
                onChange={handleInputChange}
              />
              <label htmlFor='end-time'>Enter End Time:</label>
              <input
                type='text'
                id='end_time'
                name='end_time'
                value={appointmentDetails.end_time}
                placeholder='HH:MM AM/PM'
                onChange={handleInputChange}
              />
              <label htmlFor='otherDetails'>Other Details (Optional):</label>
              <input
                type='text'
                id='otherDetails'
                name='otherDetails'
                value={appointmentDetails.otherDetails}
                onChange={handleInputChange}
              />
              {errorMessage && <div className="error2">{errorMessage}</div>}
              {formError && <div className="error2">{formError}</div>}
              <div className='popup-buttons'>
                <button className='popup-button' type='button' onClick={handleAppointmentSubmission}>
                  Submit
                </button>
                <button className='popup-button' type='button' onClick={closePopup}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isReschedulePopupOpen && (
        <div className='popup-overlay'>
          <div className='popup'>
            <h2>Reschedule Appointment</h2>
            <form className='create-appt-form'>
              <label htmlFor='reschedule-name'>Name:</label>
              <input
                type='text'
                id='reschedule-name'
                name='name'
                value={rescheduleDetails.name}
                placeholder='Full Name'
                onChange={(e) =>
                  setRescheduleDetails((prevDetails) => ({
                    ...prevDetails,
                    name: e.target.value,
                  }))
                }
                
              />
              <label htmlFor='reschedule-date'>Enter Date:</label>
              <input
                type='text'
                id='reschedule-date'
                name='date'
                value={rescheduleDetails.date}
                placeholder='YYYY-MM-DD'
                onChange={(e) =>
                  setRescheduleDetails((prevDetails) => ({
                    ...prevDetails,
                    date: e.target.value,
                  }))
                }
               
              />
              <label htmlFor='reschedule-start-time'>Enter Start Time:</label>
              <input
                type='text'
                id='reschedule-start-time'
                name='start_time'
                value={rescheduleDetails.start_time}
                placeholder='HH:MM AM/PM'
                onChange={(e) =>
                  setRescheduleDetails((prevDetails) => ({
                    ...prevDetails,
                    start_time: e.target.value,
                  }))
                }
                
              />
              <label htmlFor='reschedule-end-time'>Enter End Time:</label>
              <input
                type='text'
                id='reschedule-end-time'
                name='end_time'
                value={rescheduleDetails.end_time}
                placeholder='HH:MM AM/PM'
                onChange={(e) =>
                  setRescheduleDetails((prevDetails) => ({
                    ...prevDetails,
                    end_time: e.target.value,
                  }))
                }
              />
              {errorMessage && <div className="error2">{errorMessage}</div>}
              {ReformError && <div className="error2">{ReformError}</div>}
              <div className='popup-buttons'>
                <button className='popup-button' type='button' onClick={handleRescheduleSubmission}>
                  Submit
                </button>
                <button className='popup-button' type='button' onClick={() => setIsReschedulePopupOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPopup && selectedEvent && (
      <div className='popup-overlay'>
        <div className='popup-2'>
          <div className='topLine'>
            <button className='popup-close-button' type='button' onClick={() => setShowPopup(false)}>
                <span>x</span>
            </button>
          </div>
          <h2 className='popup-2-header'>Appointment Details</h2>
          <p>Name: {selectedEvent.title}</p>
          <p>Start Time: {selectedEvent.start.toLocaleString()}</p>
          <p>End Time: {selectedEvent.end.toLocaleString()}</p>

          <div className='popup-buttons'>
            <button className='popup-button' type='button' onClick={handleCancelAppointment}>
              Cancel Appointment
            </button>
            <button className='popup-button' type='button' onClick={handleRescheduleAppointment}>
              Reschedule Appointment
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};



export default CalendarPage;

