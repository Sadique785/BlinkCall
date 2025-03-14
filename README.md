# BlinkCall

## Overview  
**BlinkCall** is a web application that enables users to perform seamless video chat with their peers. It integrates **WebRTC** and **WebSockets** for real-time communication, providing a smooth video calling experience.  

## Features  
- Create video rooms for group calls  
- One-on-one video calling  
- WebRTC integration for real-time media streaming  
- WebSocket support for live interactions  

## Tech Stack  
- **Backend**: Django, Django REST Framework, Django Channels, PostgreSQL, Redis  
- **Frontend**: React, WebRTC  
- **Deployment**:  
 - **Backend**: AWS  
 - **Frontend**: Vercel ([Live Demo](https://blink-call-mu.vercel.app))  

## Installation & Setup  

### **Prerequisites**  
Ensure you have the following installed:  
- **Python 3.x**  
- **PostgreSQL**  
- **Node.js & npm**  

### **Steps to Run Locally**  

#### **1. Clone the Repository**  

```
git clone https://github.com/your-repo/blinkcall.git
cd blinkcall
```

## 2. Frontend Setup

```
cd frontend
npm install
npm run dev
```

## 3. Backend Setup

```
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 4. Run the Server

Navigate to the main project folder (where manage.py is located) and start the backend:

```
daphne -p 8000 -b 0.0.0.0 blinkcall.asgi:application
```
(If this command is incorrect, update it accordingly.)

## API Documentation

(API documentation will be added soon. Placeholder for future updates.)

## Deployment

Backend: AWS
Frontend: Vercel

## License

This project is not currently licensed. All rights reserved by the author.

## Contributing

Feel free to contribute! Open an issue or submit a pull request.