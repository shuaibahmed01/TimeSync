from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from mysql.connector import Error
from datetime import datetime
import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)
app.debug = True

# Establish a connection to your MySQL database
connection = mysql.connector.connect(
    host=os.environ.get('DB_HOST', 'localhost'),  # Default to 'localhost' if environment variable not found
    user=os.environ.get('DB_USER', 'root'),       # Default to 'root' if environment variable not found
    password=os.environ.get('DB_PASSWORD', 'iamironman123'),  # Default password if environment variable not found
    database=os.environ.get('DB_NAME', 'DC')       # Default to 'DC' if environment variable not found
)

if connection.is_connected():
    print("Connection Successful")

# Create a cursor object to execute SQL queries
cursor = connection.cursor()

@app.route('/api/data', methods=['GET', 'POST'])
def store_data():

    try:
        # Get the data from the request's JSON body
        data = request.json
        name = data['name']
        email = data['email']
        password = data['password']
        company = data.get('CCname', '')

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        if (company):
            # Perform the necessary database operation (e.g., insert into a table)
            sql = 'INSERT INTO Clients (name, email, password, company) VALUES (%s, %s, %s, %s)'
            values = (name, email, hashed_password, company)

            cursor.execute(sql, values)
            connection.commit()
        
            
            # # Return a success response
            return jsonify({'message': 'Data stored successfully'})
        else:
            return jsonify({'error': 'Company Not Found'}), 400

    except Exception as e:
        # Return an error response if an exception occurs
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/cc-data', methods=['POST'])
def store_cc_data():
    try:
        data = request.json
        name = data['name']
        email = data['email']
        password = data['password']
        CCname = data['CCname']
        CCkey = data['CCkey']

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


        cursor.execute("SELECT * FROM Companies WHERE CCname = %s AND CCkey = %s", (CCname, CCkey))
        company = cursor.fetchone()

        if company:
            sql = 'INSERT INTO Employees (name, email, password, CCname, CCkey) VALUES (%s, %s, %s, %s, %s)'
            values = (name, email, hashed_password, CCname, CCkey)
            cursor.execute(sql, values)
            connection.commit()

            return jsonify({'message': 'Data stored successfully'})
        else:
            # If the company does not exist, return an error response
            return jsonify({'error': 'Invalid company details'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/cc-create', methods=['POST'])
def store_cc_create():

    
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']
    CCname = data['CCname']
    CCkey = data['CCkey']
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor.execute("SELECT * FROM Companies WHERE CCname = %s", (CCname,))
    company = cursor.fetchone()



    if company:
        return jsonify({'error': 'Company Name Not Available'}), 400
    else: 
        sql = 'INSERT INTO Employees (name, email, password, CCname, CCkey) VALUES (%s, %s, %s, %s, %s)'
        values = (name, email, hashed_password, CCname, CCkey)
        cursor.execute(sql, values)
        connection.commit()

        # Generate a unique table name using the company name
        table_name = CCname.replace(' ', '_').lower()

        # Create the table
        create_table_query = f'''
        CREATE TABLE `{table_name}` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_name VARCHAR(50) NOT NULL,
            date VARCHAR(50) NOT NULL,
            start_time VARCHAR(50) NOT NULL,
            end_time VARCHAR(50) NOT NULL
        )
        '''

        try:
            cursor.execute(create_table_query)

            # Insert company details into the 'companies' table
            insert_company_query = '''
            INSERT INTO Companies (CCname, CCkey)
            VALUES (%s, %s)
            '''
            values = (CCname, CCkey)
            cursor.execute(insert_company_query, values)
            cursor.fetchall()
            connection.commit()

        except Error as e:
            print(f'Error creating table: {e}')

    return jsonify({'message': 'Data stored successfully'})

def login(email, password):
    cursor = connection.cursor()

    # Check first table for the username
    query = "SELECT * FROM Clients WHERE email = %s"
    cursor.execute(query, (email,))
    account = cursor.fetchone()
 
    
    if account and bcrypt.checkpw(password.encode('utf-8'), account[3].encode('utf-8')):

        # Account found in 'Clients' table, return account information
        account_info = {
            "name": account[1],
            "accountType": 'Client',
            "company": account[4]
        }
        return account_info

    # If not found, check second table for the username
    query = "SELECT * FROM Employees WHERE email = %s"
    cursor.execute(query, (email,))
    account = cursor.fetchone()

    if account and bcrypt.checkpw(password.encode('utf-8'), account[3].encode('utf-8')):

        # Account found in 'Clients' table, return account information
        account_info = {
            "name": account[1],
            "accountType": 'Organizer',
            "company": account[4]
        }
        return account_info
    
    # Account not found in either table
    return None



@app.route("/login", methods=["POST"])
def handle_login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    account_info = login(email, password)

    if account_info:
        return jsonify({"message": "Login successful", "account": account_info})
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    
def convert_to_24_hour_format(time_str):
    time, meridian = time_str.split(' ')
    hours, minutes = time.split(':')

    if meridian == 'PM' or meridian == 'pm':
        if hours == '12':
            hours == '12'
            return f'{hours}:{minutes}'
        hours = str(int(hours) + 12)

    if meridian == 'AM' or meridian == 'am':
        if hours == '12':
            hours = '24'

    return f'{hours}:{minutes}'

def is_within_business_hours(start_time, end_time, org_start_time, org_end_time):
 
    start_time = convert_to_24_hour_format(start_time)
    end_time = convert_to_24_hour_format(end_time)
  
    start_time = int(start_time[0:2])
    end_time = int(end_time[0:2])
    org_start_time = int(org_start_time[0:2])
    org_end_time = int(org_end_time[0:2])



    if (org_end_time > 24) and (end_time < org_start_time):
        end_time += 24
    

    # Check if the appointment start time and end time are within the orgStartTime and orgEndTime
    if org_start_time <= start_time < org_end_time and org_start_time < end_time <= org_end_time:

        return True


    return False

@app.route('/api/hour-check', methods=['POST'])
def hour_check():
    try:
        data = request.json
        start_time = data['start_time']
        end_time = data['end_time']
        dispname = data['dispname']
        cursor.execute("SELECT orgStartTime, orgEndTime FROM Companies WHERE CCname = %s", (dispname,))
        company_data = cursor.fetchone()
        org_start_time = company_data[0]
        org_end_time = company_data[1]


        if is_within_business_hours(start_time, end_time, org_start_time, org_end_time):

            return jsonify({'result': True})
        else:

            return jsonify({'result': False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/appt-create', methods=['POST'])
def store_appt_data():
    
    try:
        data = request.json
        client_name = data['client_name']
        date = data['date']
        start_time = data['start_time']
        end_time = data['end_time']
        dispname = data['dispname']

        start_time = start_time[:-3]
        end_time = end_time[:-3]
        

        table_name = '`' + dispname + '`'  # Wrap table name in backticks to handle special characters
        sql = 'INSERT INTO {} (client_name,date, start_time, end_time) VALUES (%s, %s, %s, %s)'.format(table_name)
        values = (client_name,date, start_time, end_time)
        cursor.execute(sql, values)
        connection.commit()


        return jsonify({'message': 'Data stored successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

@app.route('/api/fetch-data', methods=['GET', 'POST'])
def fetch_data():

    try:
        table_name = request.args.get('tableName')  # Get the table name from the request parameters

        cursor.execute(f'SELECT * FROM {table_name}')
        
        rows = cursor.fetchall()
        
        # Convert the rows to a list of dictionaries
        data = []
        for row in rows:
            data.append({
                'title': row[1],
                'date': row[2],
                'start_time': row[3],
                'end_time': row[4]
                # Add more columns as needed
            })

        

       

        return jsonify(data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


# API endpoint to delete an appointment
@app.route('/api/delete-appt', methods=['DELETE'])
def delete_appointment():
    try:
        appointment_data = request.json
        table = appointment_data['table']
        title = appointment_data['title']
        date = appointment_data['date']
        start_time = appointment_data['start_time'][:-3]

        
    

        table_name = '`' + table + '`'  # Wrap table name in backticks to handle special characters
        # Delete the appointment from the database
        query = "DELETE FROM {} WHERE client_name = %s AND date = %s AND start_time = %s".format(table_name)
        values = (title, date, start_time)
        cursor.execute(query, values)
        connection.commit()


        # Return a success message
        return jsonify(message='Appointment deleted successfully')

    except Exception as e:
        # Return an error message if something goes wrong
        return jsonify(error=str(e)), 500
    

@app.route('/api/update-max-appointments', methods=['PUT'])
def update_max_appointments():
    try:
        data = request.json
        ccname = data['ccname']
        max_appointments = data['maxAppointments']
        orgStartTime = data['orgStartTime']
        orgEndTime = data['orgEndTime']
        neworgendTime = ''
        print(orgStartTime)
        print(orgEndTime)

        testvar1 = int(orgStartTime[0:2])
        testvar2 = int(orgEndTime[0:2])

        if testvar2 <= testvar1:
                testvar2 += 24
                orgEndTime = orgEndTime.replace(orgEndTime[0:2], str(testvar2))

        if (orgEndTime == '00:00'):
            print('caught it')
            neworgendTime = '24:00'
        else:
            neworgendTime = orgEndTime

        print(neworgendTime)
        # Update the maxAppt value in the Companies table
        update_query = "UPDATE Companies SET maxAppt = %s, orgStartTime = %s, orgEndTime = %s WHERE CCname = %s"
        values = (max_appointments, orgStartTime, neworgendTime, ccname)
        cursor.execute(update_query, values)
        connection.commit()

        return jsonify({'message': 'Max Appointments updated successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/fetch-max-appointments', methods=['GET'])
def fetch_max_appointments():
    print('fetch max call made')
    try:
        ccname = request.args.get('ccname')


        
        # Perform a SELECT query to fetch the maxAppointments value for the company
        query = "SELECT maxAppt FROM Companies WHERE CCname = %s"

        cursor.execute(query, (ccname,))

        max_appointments = cursor.fetchone()[0]
        


        
        # Return the maxAppointments value as a JSON response
        return jsonify({'maxAppointments': max_appointments})
    
    except Exception as e:
        print("Error fetching maxAppointments from the database:", e)
        # Handle the error condition
        return jsonify({'error': 'An error occurred while fetching maxAppointments.'}), 500


if __name__ == '__main__':
    app.run(port=8000)
