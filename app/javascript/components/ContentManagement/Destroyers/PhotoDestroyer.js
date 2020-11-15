import axios from 'axios'
import React, { Fragment } from 'react'
import { setAxiosCsrfToken } from '../../Utilities/Helpers'

class PhotoDestroyer extends React.Component {
    constructor () {
        super();
        this.state = {
            photoData: null,
        }
    }

    handleDestroyPhotoButtonInput = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        axios.delete(`/api/v1/photos/${this.props.photoId}`)
        .then(res => {
            window.alert(`Photo deleted (ID:${this.props.photoId})`)
            this.props.handleClose();
        })
        .catch(err => console.log(err));
    }

    componentDidMount () {
        axios.get(`/api/v1/photos/${this.props.photoId}`)
        .then(res => {
            this.setState({ photoData: res.data.data });
        })
        .catch(err => console.log(err));
    }

    render() {
        const previewUrl = this.props.previewPhotoSize ? 
            this.state.photoData?.attributes.file[`${this.props.previewPhotoSize}`].url : 
            this.state.photoData?.attributes.file.url;

        return (
            <div className="photo-destroyer">
                {this.state.photoData &&
                    <Fragment>
                        <h3>You are about to delete a photo:</h3>
                        <p>ID: {this.props.photoId}</p>
                        <p>Image:</p>
                        <img src={previewUrl}/>
                        <br />
                        <p>Title: {this.state.photoData.attributes.title}</p>
                        <p>Tag: {this.state.photoData.attributes.tag}</p>
                        <button onClick={this.handleDestroyPhotoButtonInput}>
                            Delete
                        </button>
                        <button onClick={this.props.handleClose}>
                            Cancel
                        </button>
                    </Fragment>
                }
            </div>
        )
    }
}

export default PhotoDestroyer
