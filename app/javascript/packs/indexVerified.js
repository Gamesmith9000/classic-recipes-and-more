import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import App from '../components/App'
import FlashMessagesDisplay from '../components/FlashMessagesDisplay'
import Navbar from '../components/Navbar'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
      <Navbar />
      <FlashMessagesDisplay />
      <Route path="/" component={App} />
    </BrowserRouter>,
    document.body.appendChild(document.createElement('div'))
  )
})
