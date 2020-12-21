import axios from 'axios'
import React from 'react'
import { capitalCase, paramCase } from 'change-case';
import { ValidationErrorDisplay } from '../../Utilities/ComponentHelpers'
import BackendConstants from '../../Utilities/BackendConstants'
import { setAxiosCsrfToken } from '../../Utilities/Helpers'

class PhotoUploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            file: null,
            tag: BackendConstants.models.photo.defaults.tag,
            title: '',
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;

        let formData = new FormData();
        formData.append(`${resourceName}[file]`, this.state.file);
        formData.append(`${resourceName}[tag]`, this.state.tag);
        formData.append(`${resourceName}[title]`, this.state.title);

        axios.post(`api/v1/${resourceName}s`, formData)
        .then(res => { this.handleFormSubmitResponse(res); })
        .catch(err => { this.handleFormSubmitResponse(err); })
    }

    handleFormSubmitResponse = (res) => {
        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;

        if(res?.status === 200 && res.data && res.data.data?.type === resourceName) { this.props.handleClose(); }
        else if (res?.response?.status === 422) { this.setState({ errors: res.response.data.error }); }
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
        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;
        const displayName = capitalCase(resourceName);

        return (
            <div className={`"${paramCase(resourceName)}-uploader"`}>
                <form>
                    <h2>{`Upload ${displayName}`}</h2>
                    <label>
                        {`${displayName}`}
                        <input type="file" onChange={this.onFileInputChange} />
                        <ValidationErrorDisplay 
                            errorsObject = {this.state.errors}
                            propertyName = "file"
                        />
                    </label>
                    <label>
                        Title
                        <input type="text" onChange={this.onTitleInputChange} />
                        <ValidationErrorDisplay 
                            errorsObject = {this.state.errors}
                            propertyName = "title"
                        />
                    </label>
                    <label>
                        Tag
                        <input type="text" onChange={this.onTagInputChange} value={this.state.tag} />
                        <ValidationErrorDisplay 
                            errorsObject = {this.state.errors}
                            propertyName = "tag"
                        />
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
