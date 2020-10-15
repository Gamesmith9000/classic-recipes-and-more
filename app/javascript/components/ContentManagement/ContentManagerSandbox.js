import React, {Fragment} from 'react'
import axios from 'axios'
import PhotoUploadForm from './Forms/PhotoUploadForm';
import { renderRecipeDisplayFromResponse } from '../../ComponentHelpers'
import { getUrlForPhotoVersionSmall, setAxiosCsrfToken } from '../../Helpers'

class ContentManagerSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPhotos: [],
            photoFile: null,
            photoTitle: null,
            photoNotes: null,
            renderAllPhotos: true,
            renderPhotoUploadsForm: true,
            renderSampleRecipe: true,
            sampleRecipeResponseData: null,
            sampleRecipeId: 19,
        }
    }

    componentDidMount () {
        axios.get('/api/v1/photos.json')
        .then(res => {
            this.setState({allPhotos: res.data.data});
        })
        .catch(err => console.log(err));

        if(this.state.renderSampleRecipe && this.state.sampleRecipeId) {
            axios.get(`/api/v1/recipes/${this.state.sampleRecipeId}.json`)
            .then(res => {
                this.setState({sampleRecipeResponseData: res});
            })
            .catch(err => console.log(err));
        }
    }

    mapPhotos = (photosList) => {
        if(!photosList || photosList.length === 0) {
            return;
        }

        let mappedPhotos = photosList.map ( item => {
            return(
                <li key={item.id} className="photo-info-entry">
                    <p><span>Title: </span>{item.attributes.title}</p>
                    <img src={getUrlForPhotoVersionSmall(item.id, item.attributes.file.url)} />
                </li>);
        });

        return mappedPhotos;
    }

    sendLogoutRequest = () => {
        setAxiosCsrfToken();

        axios.delete ('/admins/sign_out')
        .then(res => {
            console.log(res);
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
                {logoutButton}
                <hr />
                {this.state.renderSampleRecipe === true && this.state.sampleRecipeResponseData &&
                    renderRecipeDisplayFromResponse(this.state.sampleRecipeResponseData)
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

export default ContentManagerSandbox
