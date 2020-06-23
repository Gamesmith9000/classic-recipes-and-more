import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Content from './Content'
import AdminLogin from './AdminLogin'

class App extends React.Component {
    render () {
        return (
            <div className="app">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/content" component={Content} />
                    <Route exact path="/content/login" component={AdminLogin} />
                </Switch>
            </div>
        );
    }
}

export default App
