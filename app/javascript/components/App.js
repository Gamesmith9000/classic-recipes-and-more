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

function App(props) {
    const redirectOnSignIn = () => {
        if(props?.giveContentPageAccess === true && hasSignedInFlashMessage === true) {
            return <Redirect to ="/content" />
        }
    }

    const renderProtectedRoute = (path, componentToRender, useExactPath = true) => {
        const loginRelativeUrl = '/admins/sign_in'
        return props?.giveContentPageAccess === true
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

    return (            
        <Fragment>
            {redirectOnSignIn()}
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/cookbook" component={Cookbook} />
                <Route exact path="/cooking-videos" component={CookingVideos} />
                <Route exact path="/recipe-photos" component={RecipePhotos} />
                <Route exact path="/seasonal" component={SeasonalRecipes} />

                <Route exact path="/sandbox" component={ContentManagerSandbox} />
                {renderProtectedRoute("/content", ContentManagementDashboard)}
            </Switch>
        </Fragment>
    );
}

export default App
