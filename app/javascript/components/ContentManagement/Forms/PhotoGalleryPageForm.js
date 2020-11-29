import axios from 'axios'
import React, { Fragment } from 'react'
import * as qs from 'qs'
import { EmptyEntryDisplay } from './Subcomponents'
import { UnsavedChangesDisplay } from '../../Utilities/ComponentHelpers'
import { ExportedPhotoPickerState, PhotoGalleryPageFormPhotoInfo } from '../../Utilities/Constructors'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'

class PhotoGalleryPageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            nextUniqueLocalId: 0,
            orderedPhotoIdData: null,
            orderedPreviewUrls: null,
            orderedPreviewUrlsNeedUpdate: false,
            priorOrderedPhotoIdData: null,
            photoPicker: new ExportedPhotoPickerState(false, 0, null, null)
        }
    }

    getIndexFromState = (localId) => {
        for(let i = 0; i < this.state.orderedPhotoIdData.length; i++) {
            if(this.state.orderedPhotoIdData[i]?.localId === localId) { return i; }
        }
        return -1;
    }

    handleAddPhotoIdData = (event) => {
        event.preventDefault();

        const nextId = this.state.nextUniqueLocalId;
        let updatedPhotoIdData = this.state.orderedPhotoIdData.slice();
        updatedPhotoIdData.push(new PhotoGalleryPageFormPhotoInfo(nextId, null));
        let previewUrls = this.state.orderedPreviewUrls.slice();
        previewUrls.push(null);

        this.setState({
            nextUniqueLocalId: nextId + 1,
            orderedPhotoIdData: updatedPhotoIdData,
            orderedPreviewUrls: previewUrls
        });
    }

    handleDeletePhotoIdData = (event, sectionIndex) => {
        event.preventDefault();

        if(window.confirm("Are you sure you want to remove this photo association?") === true) {
            let updatedPhotoIdData = this.state.orderedPhotoIdData.slice();
            updatedPhotoIdData.splice(sectionIndex, 1);

            let updatedPreviewUrls = this.state.orderedPreviewUrls.slice();
            updatedPreviewUrls.splice(sectionIndex, 1);

            this.setState({
                orderedPhotoIdData: updatedPhotoIdData,
                orderedPreviewUrls: updatedPreviewUrls
            });
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        console.log('Except when all entries are blank, then page will ask you if you are okay clearing entire list to have no entries');
        console.log('Form submit placeholder');
        // photo_page_ordered_ids
    }

    mapPhotoIdInputs = (orderedPhotoIdDataList) => {
        const nullValuePlaceholder = '...';

        return orderedPhotoIdDataList.map((element, index) => {
            if(isValuelessFalsey(element.photoId)) { console.log('Display (and submission) must be able to compensate for entries without photos.'); }
            const arrayIndex = this.getIndexFromState(element.localId);
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }
            
            return (
                <li className="ordered-photo-edits" key={element.localId}>
                    <label>Photo {arrayIndex + 1}/{orderedPhotoIdDataList.length}</label>
                    <br />
                    <label>ID: { isValuelessFalsey(element.photoId) === true ? nullValuePlaceholder : element.photoId }</label>
                    <br />
                    { this.renderPhotoControl() }
                    { this.state.orderedPhotoIdData.length > 1 &&
                        <button 
                            className="delete-item" 
                            onClick={(event) => this.handleDeletePhotoIdData(event, arrayIndex)}
                        >
                            Remove
                        </button>
                    }
                </li>
            );
        });
    }

    renderPhotoControl = () => {

    }

    updatePreviewUrls = () => {
        console.log("Send axios request to get specified photoIds. This will return an ordered array. Update state with these. Consider the case of an invalid id sent.");

        const { orderedPhotoIdData, orderedPreviewUrls, orderedPreviewUrlsNeedUpdate } = this.state;

        if(orderedPreviewUrlsNeedUpdate !== true) { return; }

        let targetData = [];
        for(let i = 0; i < orderedPhotoIdData.length; i++) {
            if(isValuelessFalsey(orderedPreviewUrls[i]) === true || orderedPreviewUrls[i] === '') {
                targetData.push(orderedPhotoIdData[i]);
            }
        }

        if(targetData.length === 0) {
            this.setState({ orderedPreviewUrlsNeedUpdate: false });
            return;
        }

        const targetIds = targetData.map((value) => { return value.photoId; })

        let config = {
            params: { photos: { ids: targetIds } },
            paramsSerializer: (params) => { return qs.stringify(params); }
        }

        axios.get('/api/v1/photos/multi.json', config)
        .then(res => {
            console.log(res);

            this.setState({
                orderedPreviewUrlsNeedUpdate: false
            });
        })
        .catch(err => console.log(err));
    }

    componentDidMount () {
        console.log('When there are blank entries, have a display message at bottom and disable submit button');
        console.log('When there are duplicate entries, have a display message at bottom and disable submit button');

        axios.get('/api/v1/aux/main.json')
        .then(res => {
            console.log(res);
            console.log('There needs to be a button allowing clearing of all blank entries. Also need to compensate for situation where only entry is blank');

            const photoPageOrderedIds = res.data.data.attributes.photo_page_ordered_ids;

            if(!photoPageOrderedIds || photoPageOrderedIds.length < 1) {
                this.setState({
                    nextUniqueLocalId: 1, 
                    orderedPhotoIdData: [new PhotoGalleryPageFormPhotoInfo(0, null)],
                    orderedPreviewUrls: [null],
                    orderedPreviewUrlsNeedUpdate: false,
                    priorOrderedPhotoIdData: [new PhotoGalleryPageFormPhotoInfo(0, null)]
                });
            }
            else {
                this.setState({
                    nextUniqueLocalId: photoPageOrderedIds.length, 
                    orderedPhotoIdData: photoPageOrderedIds.map((element, index) => (new PhotoGalleryPageFormPhotoInfo(index, element))),
                    orderedPreviewUrls: new Array(photoPageOrderedIds.length),
                    orderedPreviewUrlsNeedUpdate: true,
                    priorOrderedPhotoIdData: photoPageOrderedIds.map((element, index) => (new PhotoGalleryPageFormPhotoInfo(index, element)))
                });
            }
        })
        .catch(err => console.log(err));
    }

    render() {
        const hasOrderedPhotoIdState = Boolean(this.state.orderedPhotoIdData);
        const hasUnsavedChanges = (hasOrderedPhotoIdState === true && !objectsHaveMatchingValues(this.state.orderedPhotoIdData, this.state.priorOrderedPhotoIdData));

        if(this.state.orderedPreviewUrlsNeedUpdate === true) { this.updatePreviewUrls(); }

        return (
            <div className="photo-gallery-page-editor">
                <h2>Editing "Photo Gallery" Page</h2>
                <form className="photo-gallery-page-form" onSubmit={this.handleFormSubmit}>
                    <h3>Ordered Photos</h3>
                    { hasOrderedPhotoIdState === true && this.state.photoPicker.isOpen === false &&
                        <Fragment>
                            { this.mapPhotoIdInputs(this.state.orderedPhotoIdData) }                        
                            <button onClick={this.handleAddPhotoIdData}>+</button>
                            <br/>
                            <button disabled={!hasUnsavedChanges} type="submit">Update</button>
                            <UnsavedChangesDisplay hasUnsavedChanges={hasUnsavedChanges} />
                        </Fragment>
                    }
                </form>
            </div>
        )
    }
}

export default PhotoGalleryPageForm
