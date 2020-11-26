import axios from 'axios'
import React, { Fragment } from 'react'
import { UnsavedChangesDisplay } from '../../Utilities/ComponentHelpers'
import { PhotoGalleryPageFormPhotoInfo } from '../../Utilities/Constructors'
import { bumpArrayElement, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'

class PhotoGalleryPageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            nextUniqueLocalId: 0,
            orderedPhotoIdData: null,
            priorOrderedPhotoIdData: null
        }
    }

    handleAddPhotoIdData = (event) => {
        event.preventDefault();

        const nextId = this.state.nextUniqueLocalId;
        let updatedPhotoIdData = this.state.orderedPhotoIdData.slice();
        if(!updatedPhotoIdData) { updatedPhotoIdData = []; }
        updatedPhotoIdData.push(new PhotoGalleryPageFormPhotoInfo(nextId, null));

        this.setState({
            nextUniqueLocalId: nextId + 1,
            orderedPhotoIdData: updatedPhotoIdData 
        });
    }

    handleDeletePhotoIdData = (event, sectionIndex) => {
        event.preventDefault();

        if(window.confirm("Are you sure you want to remove this photo association?") === true) {
            let updatedPhotoIdData = this.state.orderedPhotoIdData.slice();
            updatedPhotoIdData.splice(sectionIndex, 1);
            this.setState({ orderedPhotoIdData: updatedPhotoIdData });
        }
    }

    mapPhotoIdInputs = (orderedPhotoIdDataList) => {

    }

    componentDidMount () {
        setAxiosCsrfToken();

        axios.get('/api/v1/aux/main.json')
        .then(res => {
            console.log(res);
            console.log('Note: This page needs to work with NO ordered ids in array.')

            const photoPageOrderedIds = res.data.data.attributes.photo_page_ordered_ids;

            if(!photoPageOrderedIds || photoPageOrderedIds.length < 1) {
                this.setState({
                    nextUniqueLocalId: 1, 
                    orderedPhotoIdData: new PhotoGalleryPageFormPhotoInfo(0, null),
                    priorOrderedPhotoIdData: new PhotoGalleryPageFormPhotoInfo(0, null)
                });
            }
            else {
                this.setState({
                    nextUniqueLocalId: photoPageOrderedIds.length, 
                    orderedPhotoIdData: photoPageOrderedIds.map((element, index) => (new PhotoGalleryPageFormPhotoInfo(index, element))),
                    priorOrderedPhotoIdData: photoPageOrderedIds.map((element, index) => (new PhotoGalleryPageFormPhotoInfo(index, element)))
                });
            }
        })
        .catch(err => console.log(err));
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        console.log('Form submit placeholder');
    }

    render() {
        const hasOrderedPhotoIdState = Boolean(this.state.orderedPhotoIdData);
        const hasUnsavedChanges = (hasOrderedPhotoIdState === true && !objectsHaveMatchingValues(this.state.hasOrderedPhotoIdState, this.state.priorOrderedPhotoIdData));

        return (
            <div className="photo-gallery-page-editor">
                <h2>Editing "Photo Gallery" Page</h2>
                <form className="photo-gallery-page-form" onSubmit={this.handleFormSubmit}>
                    <h3>Ordered Photos</h3>
                    { hasOrderedPhotoIdState === true &&
                        this.mapPhotoIdInputs(this.state.orderedPhotoIdData)
                    }
                    <button onClick={this.handleAddPhotoIdData}>+</button>
                    <br/>
                    <button disabled={!hasUnsavedChanges} type="submit">Update</button>
                    <UnsavedChangesDisplay hasUnsavedChanges={hasUnsavedChanges} />
                </form>
            </div>
        )
    }
}

export default PhotoGalleryPageForm
