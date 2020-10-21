import React, { Fragment } from 'react'
import PhotoUploadForm from '../Forms/PhotoUploadForm';

class PhotoManager extends React.Component {
    constructor () {
        super();
        this.state = {
            photoUploadFormIsOpen: false
        }
    }

    handleAddPhotoButtonInput = (event) => {
        event.preventDefault();

        this.setState({
            photoUploadFormIsOpen: true
        });
    }

    handleClosePhotoUploadFormButtonInput = (event) => {
        if(event){
            event.preventDefault();
        }
        this.setState({
            photoUploadFormIsOpen: false
        });
    }

    render() {
        return (
            <div className="photo-manager">
                <h1>Photo Manager</h1>
                {this.state.photoUploadFormIsOpen === false &&
                    <Fragment>
                        <button onClick={this.handleAddPhotoButtonInput}>
                            Add Photo
                        </button>
                        <br /> 
                        <br />
                    </Fragment>
                }
                {this.state.photoUploadFormIsOpen === true &&
                    <PhotoUploadForm closeForm={this.handleClosePhotoUploadFormButtonInput} />
                }
            </div>
        )
    }
}

export default PhotoManager
