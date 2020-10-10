import React, { Fragment } from 'react'
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
    hasValidAdmin = () => {
        return (this.props.currentAdmin && this.props.currentAdmin !== "" && this.props.currentAdmin != "nil" && this.props.currentAdmin.includes("@"));
    }

    /* [NOTE] This is part of the temporary authorization setup. The 'hasValidAdmin' method be used for simple exclusion for regular users, and a
        new, robust solution will be used to truly authenticate admin users. Note that there will be no production build before such a point. */

    renderProtectedRoute = (path, componentToRender, useExactPath = true) => {
        const loginRelativeUrl = '/admins/sign_in'
        return this.hasValidAdmin() === true
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
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/cookbook" component={Cookbook} />
                    <Route exact path="/cooking-videos" component={CookingVideos} />
                    <Route exact path="/recipe-photos" component={RecipePhotos} />
                    <Route exact path="/seasonal" component={SeasonalRecipes} />

                    <Route exact path="/sandbox" component={ContentManagerSandbox} />
                    {this.renderProtectedRoute("/content", ContentManagerHome)}
                </Switch>
            </div>
        );
    }
}

export default App
