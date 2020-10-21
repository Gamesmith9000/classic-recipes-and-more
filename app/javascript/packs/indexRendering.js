import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import App from '../components/App'
import FlashMessagesDisplay from '../components/FlashMessagesDisplay'
import Navbar from '../components/Navbar'

export function renderIndexToDom (allowAccessToContentPages) {
    const createTopDiv = function () {
        const element = document.body.appendChild(document.createElement('div'));
        element.className = 'app';
        return element;
    }

    document.addEventListener('DOMContentLoaded', () => {
        ReactDOM.render(
            <BrowserRouter>
            <Navbar />
            <FlashMessagesDisplay />
            <Route 
                path="/" 
                render={(props) => (
                    <App {...props} giveContentPageAccess={allowAccessToContentPages} />
                )}
            />
            </BrowserRouter>,
            createTopDiv()
        )
    });
}

