import axios from 'axios'
import { capitalCase, paramCase, sentenceCase } from 'change-case';
import React, { Fragment } from 'react'
import VersionedPhoto from '../../Misc/VersionedPhoto'
import BackendConstants from '../../Utilities/BackendConstants';
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
        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;

        axios.delete(`/api/v1/${resourceName}s/${photoId}.json`)
        .then(res => {
            const finalActions = () => {
                window.alert(`${capitalCase(resourceName)} deleted (ID:${this.props.photoId})`)
                this.props.handleClose();
            }
            if(resourceName === 'photo') {
                const removePhotoIdParams = { photo: { id: photoId } };

                axios.all([
                    axios.patch('/api/v1/aux/remove_photo_id_instances.json', removePhotoIdParams),
                    axios.patch('/api/v1/recipes/remove_photo_id_instances.json', removePhotoIdParams)
                ])
                .then(res => finalActions() )
                .catch(err => console.log(err));
            }
            else { finalActions(); }
        })
        .catch(err => console.log(err));
    }

    componentDidMount () {
        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;

        axios.get(`/api/v1/${resourceName}s/${this.props.photoId}.json`)
        .then(res => this.setState({ photoData: res.data.data }))
        .catch(err => console.log(err));
    }

    render() {
        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;

        return (
            <div className={`${paramCase(resourceName)}-destroyer`}>
                {this.state.photoData &&
                    <Fragment>
                        <h3>{sentenceCase(`You are about to delete a ${resourceName}`) + ':'}</h3>
                        <p>ID: {this.props.photoId}</p>
                        <p>Image:</p>
                        <VersionedPhoto 
                            uploadedFileData={this.state.photoData?.attributes?.file}
                            uploadedFileVersionName={this.props.previewPhotoSize}
                            uploaderNamePrefix={this.props.uploaderNamePrefix}
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
