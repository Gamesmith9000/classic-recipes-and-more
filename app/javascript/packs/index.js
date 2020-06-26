import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import App from '../components/App'
import Navbar from '../components/Navbar'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router>
      <Navbar />
      <Route path="/" component={App} />
    </Router>,
    document.body.appendChild(document.createElement('div'))
  )
})
