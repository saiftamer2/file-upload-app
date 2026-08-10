# File Upload App



The application allows users to select or drag and drop an image, preview it before uploading, validate the file, upload it to the backend, and display the uploaded image after a successful upload.

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- CSS
- XMLHttpRequest

### Backend
- Node.js
- Express
- Multer
- CORS

## Features

- Drag-and-drop image upload
- Styled file picker
- Image preview before upload
- Frontend file type validation
- Frontend file size validation
- Backend file type validation
- Backend file size validation
- Upload progress indicator
- Loading state during upload
- Local file storage
- Success and error messages
- Uploaded image preview
- Link to open the uploaded image

## File Validation

The application accepts:

- JPG
- PNG
- WEBP

Maximum file size:

- 5 MB

Validation is performed on both the frontend and backend.

## Project Structure

```text
file-upload-app/
│
├── backend/
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── FileUpload/
│   │   │       ├── FileUpload.jsx
│   │   │       └── FileUpload.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md