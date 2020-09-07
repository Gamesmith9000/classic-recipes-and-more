import React, {Fragment} from 'react'
import axios from 'axios'
import RecipeForm from './RecipeForm';
import PhotoUploadForm from './PhotoUploadForm';

class ContentManagerSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPhotos: [],
            photoFile: null,
            photoTitle: null,
            photoNotes: null,
            renderAllPhotos: true,
            renderPhotoUploadsForm: true
        }
    }

    componentDidMount () {
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
                    <p><span>Notes: </span>{item.attributes.notes}</p>
                </li>);
        });

        return mappedPhotos;
    }

    render() {
        let savedPhotosDisplay = <Fragment>
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
                <RecipeForm recipeId={null}/>
                <hr />
                <RecipeForm recipeId={11} />
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
