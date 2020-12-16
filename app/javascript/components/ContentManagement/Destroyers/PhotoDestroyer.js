import axios from 'axios'
import React, { Fragment } from 'react'
import { VersionedPhoto } from '../../Utilities/ComponentHelpers';
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
        const photoId = this.props.photoId;

        axios.delete(`/api/v1/photos/${photoId}`)
        .then(res => {
            const removePhotoIdParams = { photo: { id: photoId } };

            axios.all([
                axios.patch('/api/v1/aux/remove_photo_id_instances.json', removePhotoIdParams),
                axios.patch('/api/v1/recipes/remove_photo_id_instances.json', removePhotoIdParams)
            ])
            .then(res => {
                window.alert(`Photo deleted (ID:${this.props.photoId})`)
                this.props.handleClose();
            })
            .catch(err => console.log(err));
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
        return (
            <div className="photo-destroyer">
                {this.state.photoData &&
                    <Fragment>
                        <h3>You are about to delete a photo:</h3>
                        <p>ID: {this.props.photoId}</p>
                        <p>Image:</p>
                        <VersionedPhoto 
                            photoFileData={this.state.photoData?.attributes?.file}
                            photoVersionName={this.props.previewPhotoSize}
                        />
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
