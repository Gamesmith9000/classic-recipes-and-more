import React from 'react'
import { Route, Switch } from 'react-router-dom'

import About from './Pages/About'
import Cookbook from './Pages/Cookbook'
import CookingVideos from './Pages/CookingVideos'
import Home from './Pages/Home'
import RecipePhotos from './Pages/RecipePhotos'
import SeasonalRecipes from './Pages/SeasonalRecipes'

import ContentManagerSandbox from './Pages/ContentManagerSandbox'

class App extends React.Component {
    render () {
        return (
            <div className="app">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/cookbook" component={Cookbook} />
                    <Route exact path="/cooking-videos" component={CookingVideos} />
                    <Route exact path="/recipe-photos" component={RecipePhotos} />
                    <Route exact path="/seasonal" component={SeasonalRecipes} />

                    <Route exact path="/sandbox" component={ContentManagerSandbox} />
                </Switch>
            </div>
        );
    }
}

export default App
