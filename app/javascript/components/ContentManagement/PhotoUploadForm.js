import React, {Fragment} from 'react'
import axios from 'axios'

class PhotoUploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoFile: null,
            photoTitle: null,
            photoNotes: null,
        }
    }

    handlePhotoUploadSubmit = (event) => {
        event.preventDefault();

        const csrfToken = document.querySelector('meta[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        let formData = new FormData();
        formData.append('photo[file]', this.state.photoFile);
        formData.append('photo[title]', this.state.photoTitle);
        formData.append('photo[notes]', this.state.photoNotes);

        axios.post('api/v1/photos', formData)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    onPhotoFileInputChange = (event) => {
        this.setState({photoFile: event.target.files[0]})
    }

    onPhotoTitleInputChange = (event) => {
        this.setState({photoTitle: event.target.value})
    }
    
    onPhotoNotesInputChange = (event) => {
        this.setState({photoNotes: event.target.value})
    }

    render() {
        return (
            <div className="photo-uploader">
                <form onSubmit={this.handlePhotoUploadSubmit}>
                    <h4>Upload Photo</h4>
                    <label>
                        Photo
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
        )
    }
}

export default PhotoUploadForm
