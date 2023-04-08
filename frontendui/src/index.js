import React from 'react';
import { createRoot } from 'react-dom/client' //cannot use ReactDom in react 18, instead use createroot
import App from './App';
import './index.css';
import { BrowserRouter as Router} from 'react-router-dom' // routing purpose
import { GoogleOAuthProvider } from '@react-oauth/google'; // google authentication

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId = {process.env.REACT_APP_GOOGLE_API_TOKEN}>
        <Router>
        <App/>
        </Router>
    </GoogleOAuthProvider>   
)
