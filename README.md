MERN File Upload with MongoDB
This repository contains a MERN stack application that allows users to upload files to Google Drive and store form data (title, subject, semester, unit, worksheet number, file category) in a MongoDB database.

Setup
To run this application, you will need to have the following installed on your machine:

Node.js
npm
MongoDB
Google Cloud Platform account with a project and OAuth2 client credentials
Once you have these installed, you can clone this repository and install the dependencies:

<code> git clone https://github.com/your-username/mern-file-upload.git <br>
cd mern-file-upload <br>
npm install <br>
</code>


You will also need to create a .env file in the root of the project with the following environment variables:
<code>MONGO_URI=<your-mongodb-uri>
CLIENT_ID=<your-google-client-id>
CLIENT_SECRET=<your-google-client-secret>
REDIRECT_URI=<your-google-redirect-uri></code>

Running the Application
To run the application, start the server with the following command:

<code>npm start</code>

This will start both the server and the client. The client will be accessible at http://localhost:3000, and the server will be accessible at http://localhost:5000.

Uploading Files
To upload a file, navigate to the upload form on the client (http://localhost:3000/upload) and fill in the form fields (title, subject, semester, unit, worksheet number, file category). Then, select the file you want to upload and click "Submit". This will send the file to Google Drive and store the form data in the MongoDB database.

License
This project is licensed under the MIT License. See the LICENSE file for more information.