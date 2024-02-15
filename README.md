# Video Handling Application

This Node.js application provides a simple solution for downloading a video from Google Drive and uploading it to another folder in Google Drive.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
Install dependencies:

```bash
npm install
```
Create a service account and obtain API keys:

Create a service account on the Google Cloud Console.
Download the JSON key file for the service account.
Share the video with the service account email address on Google Drive.
Set up API keys:

Rename the downloaded JSON key file to apikey.json.
Update the apikey.json file with the appropriate values.
Running the Application
```bash
npm start
```
The application will start on http://localhost:3000. Ensure the server is running before making API requests.

API Endpoints
1. /processVideo - POST
Initiates the download and upload processes.

Request Body:
```
json
{
  "fileId": "google-drive-file-id",
  "destinationFolderId": "google-drive-folder-id"
}
```
Response:

200 OK: Video processing complete
400 Bad Request: Missing request body
500 Internal Server Error: If an error occurs during processing
2. /status - GET
Monitors the status of the download and upload processes.

Response:
```
json
[
  { "task": "download", "status": "in-progress" },
  { "task": "upload", "status": "complete" }
]
```
Testing
To test the application, you can use tools like Postman or curl to send requests to the /processVideo endpoint.

Additional Notes
Ensure that the Google Drive API is enabled for your project.
The service account associated with the API keys should have the necessary permissions on Google Drive.
Wait a few minutes after enabling the API for changes to propagate.
