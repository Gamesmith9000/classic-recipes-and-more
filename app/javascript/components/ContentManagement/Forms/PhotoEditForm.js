import React from 'react'
import axios from 'axios'
import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../../ComponentHelpers'
import { setAxiosCsrfToken } from '../../../Helpers'

class PhotoEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            previewUrl: null,
            priorPhotoState: {
                tag: '',
                title: ''
            },
            tag: '',
            title: ''
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();
        const { tag, title } = this.state;

        axios.patch(`/api/v1/photos/${this.props.photoId}`, { tag, title })
        .then( res => { this.handleFormSubmitResponse(res); })
        .catch(err => { this.handleFormSubmitResponse(err); });
    }

    handleFormSubmitResponse = (res) =>{
        if(res?.status === 200 && res.data && res.data.data?.type === "photo") {
            this.setState({
                errors: null,
                priorPhotoState: {
                    tag: this.state.tag,
                    title: this.state.title
                }
            });
        }
        else if (res?.response?.status === 422) { this.setState({ errors: res.response.data.error }); }
    }

    hasChanges = () => {
        return (this.state.tag !== this.state.priorPhotoState.tag || this.state.title !== this.state.priorPhotoState.title)
    }

    onTagInputChange = (event) => {
        this.setState({ tag: event.target.value.toUpperCase() })
    }

    onTitleInputChange = (event) => {
        this.setState({ title: event.target.value })
    }

    componentDidMount() {
        axios.get(`/api/v1/photos/${this.props.photoId}`)
        .then(res => {
            const { tag, title } = res.data.data.attributes;
            const previewUrl = this.props.previewPhotoSize ? res.data.data.attributes.file[`${this.props.previewPhotoSize}`].url: res.data.data.attributes.file.url;
            this.setState({
                previewUrl: previewUrl,
                priorPhotoState:  {
                    tag: tag,
                    title: title
                },
                tag: tag,
                title: title
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="photo-editor">
                <form>
                    <h2>Edit Photo Details</h2>
                    <p>ID: {this.props.photoId}</p>
                    <label>
                        Image:
                        <br />
                        <img src={this.state.previewUrl} />
                    </label>
                    <br />
                    <label>
                        Title
                        <input 
                            name="title"
                            onChange={this.onTitleInputChange}
                            type="text" 
                            value={this.state.title}
                        />
                        <ValidationErrorDisplay 
                            errorsObject = {this.state.errors}
                            propertyName = "title"
                        />
                    </label>
                    <label>
                        Tag
                        <input
                            name="tag" 
                            onChange={this.onTagInputChange}
                            type="text" 
                            value={this.state.tag}
                        />
                        <ValidationErrorDisplay 
                            errorsObject = {this.state.errors}
                            propertyName = "tag"
                        />
                    </label>
                    <br/>
                    <button onClick={this.handleFormSubmit}>Update</button>
                    <button onClick={this.props.handleClose}>Close</button>
                    <UnsavedChangesDisplay hasUnsavedChanges={this.hasChanges() === true} />
                </form>
                <hr/>
            </div>
        )
    }
}

export default PhotoEditForm
