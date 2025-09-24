import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import PlayerContextProvider from './context/PlayerContext.jsx'; // This line is the issue

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <PlayerContextProvider>
                <App />
            </PlayerContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);