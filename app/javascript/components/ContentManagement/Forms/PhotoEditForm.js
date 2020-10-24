import React from 'react'
import axios from 'axios'
import { setAxiosCsrfToken, validationErrorsToString } from '../../../Helpers'

class PhotoEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            photoTitle: "",
            photoPreviewUrl: null,
        }
    }

    onPhotoTitleInputChange = (event) => {
        this.setState({photoTitle: event.target.value})
    }

    render() {
        return (
            <div className="photo-editor">
                <form>
                    <h2>Edit Photo Details</h2>
                    <label>
                        Photo
                        <img src={this.state.photoPreviewUrl} />
                    </label>
                    <label>
                        Title
                        {/* <input type="text" onChange={this.onPhotoTitleInputChange} /> */}
                    </label>
                    {this.state.errors?.title ?
                        <div className="validation-error">
                            {validationErrorsToString("Title", this.state.errors.title)}
                        </div>
                    :
                        <br/>
                    }
                    <button onClick={this.props.closeForm}>Close</button>
                </form>
                <hr/>
            </div>
        )
    }
}

export default PhotoEditForm
