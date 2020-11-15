import axios from 'axios'
import React, {Fragment} from 'react'
import { UnsavedChangesDisplay } from '../../Utilities/ComponentHelpers'
import { arraysHaveMatchingValues, bumpArrayElement, setAxiosCsrfToken } from '../../Utilities/Helpers'

class PhotoGalleryPageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            orderedPhotoIds: null,
            priorOrderedPhotoIdsState: null
        }
    }

    componentDidMount () {
        setAxiosCsrfToken();

        axios.get('/api/v1/aux/main.json')
        .then(res => {
            console.log(res);
            console.log('Note: This page needs to work with NO ordered ids in array.')

            const photoPageOrderedIds = res.data.data.attributes.photo_page_ordered_ids;
            this.setState({
                orderedPhotoIds: photoPageOrderedIds,
                priorOrderedPhotoIdsState: photoPageOrderedIds
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <Fragment>
                <h2>Editing "Photo Gallery" Page</h2>
                <form className="photo-gallery-page-form">
                    
                </form>
            </Fragment>
        )
    }
}

export default PhotoGalleryPageForm
