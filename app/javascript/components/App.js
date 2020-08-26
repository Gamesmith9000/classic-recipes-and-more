import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Cookbook from './Pages/Cookbook'
import CookingVideos from './Pages/CookingVideos'
import SeasonalRecipes from './Pages/SeasonalRecipes'

class App extends React.Component {
    render () {
        return (
            <div className="app">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/cookbook" component={Cookbook} />
                    <Route exact path="/seasonal" component={SeasonalRecipes} />
                    <Route exact path="/videos" component={CookingVideos} />
                </Switch>
            </div>
        );
    }
}

export default App
