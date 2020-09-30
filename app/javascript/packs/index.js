import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import App from '../components/App'
import Navbar from '../components/Navbar'

document.addEventListener('DOMContentLoaded', () => {
  const currentAdminNode = document.getElementById('current-admin');
  const currentAdminData = currentAdminNode.getAttribute('data-current-admin');
  document.body.removeChild(currentAdminNode);
  ReactDOM.render(
    <BrowserRouter>
      <Navbar />
      <Route path="/">
        <App currentAdmin={currentAdminData} />
      </Route>
    </BrowserRouter>,
    document.body.appendChild(document.createElement('div'))
  )
})
