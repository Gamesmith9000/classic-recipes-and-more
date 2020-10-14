import React, { Fragment } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import About from './Pages/About'
import Cookbook from './Pages/Cookbook'
import CookingVideos from './Pages/CookingVideos'
import Home from './Pages/Home'
import RecipePhotos from './Pages/RecipePhotos'
import SeasonalRecipes from './Pages/SeasonalRecipes'

import ContentManagerSandbox from './ContentManagement/ContentManagerSandbox'
import ContentManagementDashboard from './ContentManagement/ContentManagementDashboard'

class App extends React.Component {
    // [NOTE] adminVerified needs to have security beefed up and security tested

    adminVerified = () => {
        return !!currentAdmin?.email;
    }

    redirectOnSignIn = () => {
        if(this.adminVerified() === true && hasSignedInFlashMessage === true) {
            return <Redirect to ="/content" />
        }
    }

    renderProtectedRoute = (path, componentToRender, useExactPath = true) => {
        const loginRelativeUrl = '/admins/sign_in'
        return this.adminVerified() === true
        ?
            <Route 
                component={componentToRender}
                exact={useExactPath} 
                path={path} 
            />
        :
            <Route 
                component={ () => {
                        // [NOTE] Verify security of this approach, history (back button, etc) seems to work well enough
                        window.location.replace(loginRelativeUrl);
                        return null;
                    }
                }
                path={'/content'} 
            />
        ;
    }

    render () {
        return (
            <div className="app">
                {this.redirectOnSignIn()}
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/cookbook" component={Cookbook} />
                    <Route exact path="/cooking-videos" component={CookingVideos} />
                    <Route exact path="/recipe-photos" component={RecipePhotos} />
                    <Route exact path="/seasonal" component={SeasonalRecipes} />

                    <Route exact path="/sandbox" component={ContentManagerSandbox} />
                    {this.renderProtectedRoute("/content", ContentManagementDashboard)}
                </Switch>
            </div>
        );
    }
}

export default App
