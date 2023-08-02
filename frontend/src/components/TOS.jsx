import React from 'react'
import './Homepage.css';
function TOS() {
  return (
    <div className='tos-container'>
        <h2 className='TOS-header'> Terms of Service</h2>
        <p className='TOS'> 
        Welcome to TimeSync. These Terms of Service govern your use of
        the Application, so please read them carefully before using the service. By using the application, you agree to be bound by these Terms.
        If you do not agree to these Terms, please refrain from using the Application.
        </p>
        <h2 className='TOS-subheader'>1. Description of the Service</h2>
        <p className='TOS'>
        The Application provides a scheduling platform that enables clients to schedule appointments with respective organizations.
        The service also allows organizations to view their schedules and manage appointments.
        </p>
        <h2 className='TOS-subheader'>2. User Accounts</h2>
        <p className='TOS'>
        2.1. Clients: To use the scheduling features, clients must create an account. By creating an account,
        clients agree to provide accurate and up-to-date information and to protect their login credentials.
        Clients are responsible for maintaining the confidentiality of their account information.
        </p>
        <p className='TOS'>
        2.2. Organizers: Organizations must create an account to access the scheduling and appointment management features.
        Organizations are responsible for all activities that occur under their accounts and for safeguarding their login credentials.
        </p>
        <h2 className='TOS-subheader'>3. Scheduling Appointments</h2>
        <p className='TOS'>
        3.1. Clients can schedule, cancel, and reschedule their own appointments through the Application, subject to the availability
        set by the respective organization. They are not allowed to view any information other than the times, of other appointments within
        the organization.
        </p>
        <p className='TOS'>
        3.2. Organizations can view, cancel, or create, and edit appointments made by clients. They are also equipped with the ability to view
        appointment names, times, and other details provided by clients.
        </p>
        <h2 className='TOS-subheader'>4. Use of Information</h2>
        <p className='TOS'>
        4.1. The Application will collect and store personal information from users as described in our <a href='/PrivacyPolicy' className='footer-link'>Privacy Policy</a>. 
        By using the Application, you consent to the collection and use of your personal information
        in accordance with the Privacy Policy.
        </p>
        <p className='TOS'>
        4.2. Users understand that information shared with the respective organization during the appointment scheduling process
        may be used by the organization to provide services and improve their operations.   
        </p>
        <h2 className='TOS-subheader'>5. User Responsibilities</h2>
        <p className='TOS'>
        5.1. Users are solely responsible for their interactions with others through the Application. Users agree to act in a
        respectful and professional manner when using the service.
        </p>
        <p className='TOS'>
        5.2. Users are prohibited from using the Application for any unlawful, unauthorized, or fraudulent purposes.
        </p>
        <h2 className='TOS-subheader'>6. Limitations of Liability</h2>
        <p className='TOS'>
        6.1. The Application's developers and affiliates shall not be liable for any damages or losses resulting from
        the use of the service.
        </p>
        <p className='TOS'>
        6.2. The Application is provided "as-is," and its developers make no warranties or guarantees regarding
        its functionality, reliability, or accuracy.
        </p>
        <h2 className='TOS-subheader'>7. Intellectual Property</h2>
        <p className='TOS'>
        7.1. The Application and its original content, features, and functionality are owned by TimeSync.
        All rights are reserved.
        </p>
        <h2 className='TOS-subheader'>8. Modifications to the Terms of Service</h2>
        <p className='TOS'>
        8.1. TimeSync reserves the right to modify or update these Terms at any time. Users will be notified
        of any significant changes, and continued use of the Application after such modifications shall constitute consent to the
        updated Terms.
        </p>
        <h2 className='TOS-subheader'>9. Termination of Accounts</h2>
        <p className='TOS'>
        9.1. TimeSync reserves the right to terminate or suspend any user account at its discretion,
        with or without notice, for violations of these Terms or any applicable laws.
        </p>
    </div>
  )
}

export default TOS