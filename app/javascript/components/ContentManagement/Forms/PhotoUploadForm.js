import React, {Fragment} from 'react'
import axios from 'axios'
import { setAxiosCsrfToken, validationErrorsToString } from '../../../Helpers'

class PhotoUploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            photoFile: null,
            photoTitle: "",
        }
    }

    handlePhotoUploadSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        let formData = new FormData();
        formData.append('photo[file]', this.state.photoFile);
        formData.append('photo[title]', this.state.photoTitle);

        axios.post('api/v1/photos', formData)
        .then(res => {
            this.handlePhotoUploadResponse(res)
        })
        .catch(err => {
            this.handlePhotoUploadResponse(err)
        })
    }

    onPhotoFileInputChange = (event) => {
        this.setState({photoFile: event.target.files[0]})
    }

    onPhotoTitleInputChange = (event) => {
        this.setState({photoTitle: event.target.value})
    }

    handlePhotoUploadResponse = (res) => {

        console.log(res);
        console.log(res.response);

        if(res?.status === 200 && res.data) {
            if(res.data.data?.type === "photo") {
                // SUCCESS
                // data: { data: type: "photo" }
            }
            else {
                // NOT SIGNED IN
                // { data: "A GIANT STRING!" }
                //      It contains the html for the devise login page
                //      Need to redirect to login page
            }
        }
        else if (res?.response?.status === 422) {
            this.setState({errors: res.response.data.error});
        }
    }
    
    mapErrorMessages = () => {

    }

    render() {
        // [NOTE] This component has several unfinished aspects
        return (
            <div className="photo-uploader">
                <form onSubmit={this.handlePhotoUploadSubmit}>
                    <h2>Upload Photo</h2>
                    <label>
                        Photo
                        <input type="file" onChange={this.onPhotoFileInputChange} />
                    </label>
                    {this.state.errors?.file ?
                        <div className="validation-error">
                            {validationErrorsToString("File", this.state.errors.file)}
                        </div>
                    :
                        <br/>
                    }
                    <label>
                        Title
                        <input type="text" onChange={this.onPhotoTitleInputChange} />
                    </label>
                    {this.state.errors?.title ?
                        <div className="validation-error">
                            {validationErrorsToString("Title", this.state.errors.title)}
                        </div>
                    :
                        <br/>
                    }
                    <button type="submit">Upload</button>
                </form>
                <hr/>
            </div>
        )
    }
}

export default PhotoUploadForm
