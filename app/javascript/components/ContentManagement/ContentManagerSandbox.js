import React, {Fragment} from 'react'
import axios from 'axios'
import RecipeForm from './RecipeForm';
import PhotoUploadForm from './PhotoUploadForm';
import { getDataAndRenderRecipeDisplay } from '../../ComponentHelpers'

class ContentManagerSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPhotos: [],
            currentAdmin: null,
            photoFile: null,
            photoTitle: null,
            photoNotes: null,
            renderAllPhotos: true,
            renderPhotoUploadsForm: true,
            renderSampleRecipe: true,
            sampleRecipeId: 7
        }
    }

    componentDidMount () {
        this.retrieveCurrentAdmin();

        axios.get('/api/v1/photos.json')
        .then(res => {
            console.log(res);
            this.setState({ allPhotos: res.data.data })
        })
        .catch(err => console.log(err));
    }

    mapPhotos = (photosList) => {
        if(!photosList || photosList.length === 0) {
            return;
        }

        let mappedPhotos = photosList.map ( item => {
            return(
                <li key={item.id} className="photo-info-entry">
                    <p><span>Title: </span>{item.attributes.title}</p>
                    <img src={item.attributes.file.url} />
                </li>);
        });

        return mappedPhotos;
    }

    retrieveCurrentAdmin = () => {
        axios.get('/get_current_admin.json')
        .then(res => {
            console.log(res);
            this.setState({ currentAdmin: res?.data?.email});
        })
        .catch(err => console.log(err));
    }

    sendLogoutRequest = () => {
        const csrfToken = document.querySelector('meta[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        axios.delete ('/admins/sign_out')
        .then(res => {
            console.log(res);
            this.retrieveCurrentAdmin();
        })
        .catch(err => console.log(err));
    }

    render() {
        const logoutButton = <button onClick={this.sendLogoutRequest}>
            Logout
        </button>

        const savedPhotosDisplay = <Fragment>
            <h4>All Saved Photos</h4>
            <ul className="all-photos-list">
                { this.mapPhotos (this.state.allPhotos) }
            </ul>
            <hr/>
        </Fragment>

        return (
            <div className="content-manager-sandbox">
                <p>[ContentManagerSandbox Component]</p>
                <hr />
                <p>Current admin: &nbsp; <strong>{ this.state.currentAdmin ? this.state.currentAdmin : "[No admin logged in]" }</strong></p>
                {this.state.currentAdmin &&
                    logoutButton
                }
                <hr />
                <RecipeForm recipeId={null}/>
                <hr />
                <RecipeForm recipeId={this.state.sampleRecipeId} />
                <hr />
                {this.state.renderSampleRecipe === true &&
                    getDataAndRenderRecipeDisplay(this.state.sampleRecipeId)
                }
                <hr />
                {this.state.renderPhotoUploadsForm === true &&
                    <PhotoUploadForm />
                }
                {this.state.renderAllPhotos === true &&
                    savedPhotosDisplay
                }
            </div>
        )
    }
}

// [NOTE] there is currently no production build. Authentication is not yet implemented for this reason.

export default ContentManagerSandbox
