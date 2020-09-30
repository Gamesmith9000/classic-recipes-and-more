import React from 'react'
import { Route, Switch } from 'react-router-dom'

import About from './Pages/About'
import Cookbook from './Pages/Cookbook'
import CookingVideos from './Pages/CookingVideos'
import Home from './Pages/Home'
import RecipePhotos from './Pages/RecipePhotos'
import SeasonalRecipes from './Pages/SeasonalRecipes'

import ContentManagerSandbox from './ContentManagement/ContentManagerSandbox'
import ContentManagerHome from './ContentManagement/ContentManagerHome'

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

                    <Route 
                        exact path="/sandbox"
                        render={(props) => (
                            <ContentManagerSandbox currentAdmin={this.props.currentAdmin}/>
                        )}
                    />
                    <Route 
                        exact path="/content"
                        render={(props) => (
                            <ContentManagerHome currentAdmin={this.props.currentAdmin}/>
                        )}
                    />
                </Switch>
            </div>
        );
    }
}

export default App
