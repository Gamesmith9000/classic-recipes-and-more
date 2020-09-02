import React, {Fragment} from 'react'
import axios from 'axios'
import RecipeForm from './RecipeForm';

class ContentManagerSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPhotos: [],
            photoFile: null,
            photoTitle: null,
            photoNotes: null
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


    handlePhotoUploadSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.photoFile);
        console.log(this.state.photoTitle);
        console.log(this.state.photoNotes);

        const csrfToken = document.querySelector('meta[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        axios.post('api/v1/photos', {
            file:  this.state.photoFile,
            title: this.state.photoTitle,
            notes: this.state.photoNotes
        })
        .then(res => console.log(res))
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

    onPhotoFileInputChange = (event) => {
        console.log(event.target.files);
        console.log(event.target.files[0]);

        this.setState({photoFile: event.target.files[0]})
    }

    onPhotoTitleInputChange = (event) => {
        this.setState({photoTitle: event.target.value})
    }
    
    onPhotoNotesInputChange = (event) => {
        this.setState({photoNotes: event.target.value})
    }

    render() {
        let imageUploadForm = <div className="photo-uploader">
            <hr/>
            <form onSubmit={this.handlePhotoUploadSubmit}>
                <h4>Photo Uploader</h4>
                <label>
                    Image
                    <input type="file" onChange={this.onPhotoFileInputChange} />
                </label>
                <br/>
                <label>
                    Title
                    <input type="text" onChange={this.onPhotoTitleInputChange} />
                </label>
                <br/>
                <label>
                    Notes
                    <input type="text" onChange={this.onPhotoNotesInputChange} />
                </label>
                <br/>
                <br/>
                <button type="submit">Upload</button>
            </form>
            <hr/>
        </div>

        return (
            <div className="content-manager-sandbox">
                <p>[ContentManagerSandbox Component]</p>
                <hr />
                <RecipeForm />
                {imageUploadForm}
                <Fragment>
                    <h4>All Saved Photos</h4>
                    <ul className="all-photos-list">
                        { this.mapPhotos (this.state.allPhotos) }
                    </ul>
                    <hr/>
                </Fragment>
            </div>
        )
    }
}

// [NOTE] there is currently no production build. Authentication is not yet implemented for this reason.

export default ContentManagerSandbox
