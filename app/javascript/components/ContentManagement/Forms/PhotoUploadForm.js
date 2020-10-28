import React, {Fragment} from 'react'
import axios from 'axios'
import { renderValidationError } from '../../../ComponentHelpers'
import { setAxiosCsrfToken, validationErrorsToString } from '../../../Helpers'

class PhotoUploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            file: null,
            tag: 'DEFAULT', // [NOTE] Hard-coded value of the db field default
            title: '',
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        let formData = new FormData();
        formData.append('photo[file]', this.state.file);
        formData.append('photo[tag]', this.state.tag);
        formData.append('photo[title]', this.state.title);

        axios.post('api/v1/photos', formData)
        .then(res => { this.handleFormSubmitResponse(res); })
        .catch(err => { this.handleFormSubmitResponse(err); })
    }

    handleFormSubmitResponse = (res) => {
        if(res?.status === 200 && res.data && res.data.data?.type === "photo") {
            this.props.handleClose();
        }
        else if (res?.response?.status === 422) {
            this.setState({ errors: res.response.data.error });
        }
    }

    onFileInputChange = (event) => {
        this.setState({ file: event.target.files[0] })
    }

    onTagInputChange = (event) => {
        this.setState({ tag: event.target.value })
    }

    onTitleInputChange = (event) => {
        this.setState({ title: event.target.value })
    }

    render() {
        const errors = this.state.errors;
        return (
            <div className="photo-uploader">
                <form>
                    <h2>Upload Photo</h2>
                    <label>
                        Photo
                        <input type="file" onChange={this.onFileInputChange} />
                        { renderValidationError('file', errors) }
                    </label>
                    <label>
                        Title
                        <input type="text" onChange={this.onTitleInputChange} />
                        { renderValidationError('title', errors) }
                    </label>
                    <label>
                        Tag
                        <input type="text" onChange={this.onTagInputChange} value={this.state.tag} />
                        { renderValidationError('tag', errors) }
                    </label>
                    <button onClick={this.handleFormSubmit}>Upload</button>
                    <button onClick={this.props.closeForm}>Close</button>
                </form>
                <hr/>
            </div>
        )
    }
}

export default PhotoUploadForm
