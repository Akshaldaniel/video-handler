const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const { Readable } = require('stream');
const { JWT } = require('google-auth-library');

const apiKeys = require('./apikey.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const drive = google.drive({
  version: 'v3',
  auth: new JWT({
    email: apiKeys.client_email,
    key: apiKeys.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
  }),
});

const status = [];

const downloadVideo = async (fileId, filePath) => {
  const dest = fs.createWriteStream(filePath);
  console.log('Downloading video...');
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

  return new Promise((resolve, reject) => {
    res.data
      .on('end', () => {
        console.log('Download complete');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error downloading video:', err);
        reject(err);
      })
      .pipe(dest);
  });
};

const uploadVideo = async (filePath, parentId) => {
  console.log('Uploading video...');
  const media = {
    mimeType: 'video/*',
    body: Readable.from(fs.createReadStream(filePath)),
  };

  const params = {
    media,
    resource: {
      name: 'Uploaded Video',
      parents: [parentId],
    },
  };

  const res = await drive.files.create(params);

  console.log('Upload complete:', res.data);
};

app.post('/processVideo', async (req, res) => {
  console.log('Received request body:', req.body);

  if (!req.body) {
    return res.status(400).send('Bad Request: Missing request body');
  }
  const { fileId, destinationFolderId } = req.body;
  try {
    status.push({ task: 'download', status: 'in-progress' });
    await downloadVideo(fileId, 'downloaded_video.mp4');
    status.push({ task: 'upload', status: 'in-progress' });
    await uploadVideo('downloaded_video.mp4', destinationFolderId);
    status.push({ task: 'download', status: 'complete' });
    status.push({ task: 'upload', status: 'complete' });
    res.status(200).send('Video processing complete');
  } catch (error) {
    console.error('Error processing video:', error);
    status.push({ task: 'error', status: 'failed', error: error.message });
    res.status(500).send('Internal Server Error');
  }
});

app.get('/status', (req, res) => {
  res.status(200).json(status);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});