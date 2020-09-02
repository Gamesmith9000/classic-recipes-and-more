import React, {Fragment} from 'react'
import axios from 'axios'

class ContentManagerSandbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoFile: null,
            photoTitle: null,
            photoNotes: null
        }
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
        let imageUploadForm = <Fragment>
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
                <button type="submit">Upload</button>
            </form>
            <hr/>
        </Fragment>

        return (
            <div className="content-manager-sandbox">
                <p>[ContentManagerSandbox Component]</p>
                {imageUploadForm}
            </div>
        )
    }
}

// [NOTE] there is currently no production build. Authentication is not yet implemented for this reason.

export default ContentManagerSandbox
