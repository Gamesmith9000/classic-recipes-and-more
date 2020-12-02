import React, { Fragment } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import About from './Pages/About'
import Cookbook from './Pages/Cookbook'
import CookingVideos from './Pages/CookingVideos'
import FeaturedRecipes from './Pages/FeaturedRecipes'
import Home from './Pages/Home'
import PhotoGallery from './Pages/PhotoGallery'
import Shop from './Pages/Shop'


import ContentMasterManager from './ContentManagement/Managers/ContentMasterManager'

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
            { redirectOnSignIn() }
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/cookbook" component={Cookbook} />
                <Route exact path="/cooking-videos" component={CookingVideos} />
                <Route 
                    exact path="/featured-recipes"
                    render={(props) => (
                        <FeaturedRecipes {...props} previewPhotoVersion="small" />
                    )}
                />
                <Route exact path="/photo-gallery" component={PhotoGallery} />
                <Route exact path="/shop" component={Shop} />
                
                { renderProtectedRoute("/content", ContentMasterManager) }
            </Switch>
        </Fragment>
    );
}

export default App
