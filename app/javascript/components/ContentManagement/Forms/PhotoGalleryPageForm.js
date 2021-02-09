import axios from 'axios'
import React, { Fragment } from 'react'
import qs from 'qs'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import PhotoPicker from '../Pickers/PhotoPicker'

import VersionedPhoto from '../../Misc/VersionedPhoto'
import { UnsavedChangesDisplay } from '../../Utilities/ComponentHelpers'
import { ExportedPhotoPickerState, PhotoGalleryPageFormPhotoInfo } from '../../Utilities/Constructors'
import BackendConstants from '../../Utilities/BackendConstants'
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
            photoPicker: new ExportedPhotoPickerState(false, 0, null, null),
            photoPickerCallerLocalId: null
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

    handleDeletePhotoIdData = (event, sectionIndex, skipConfirmation = false) => {
        event.preventDefault();

        const confirmedClose = skipConfirmation === false 
        ? (window.confirm("Are you sure you want to remove this photo association?") === true)
        : true;

        if(confirmedClose === true) {
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
        setAxiosCsrfToken();

        const outgoingPhotoIdData = this.state.orderedPhotoIdData.map((element) => { return element.photoId; });
        axios.patch('/api/v1/aux/main.json', { aux_data: { photo_page_ordered_ids: outgoingPhotoIdData } })
        .then(res => this.setState({ priorOrderedPhotoIdData: this.state.orderedPhotoIdData.slice() }))
        .catch(err => console.log(err));
    }

    handlePhotoIdDataChange = (event) => {
        event.preventDefault();

        const { photoPicker: { selectedPhotoId }, photoPickerCallerLocalId } = this.state;
        const index = this.getIndexFromState(photoPickerCallerLocalId);
        const newPhotoPickerState = new ExportedPhotoPickerState(false, null, null, null);

        let updatedPhotoIdData = this.state.orderedPhotoIdData.slice();
        updatedPhotoIdData[index] = new PhotoGalleryPageFormPhotoInfo(photoPickerCallerLocalId, selectedPhotoId);

        let updatedOrderedPreviewUrls = this.state.orderedPreviewUrls.slice();
        updatedOrderedPreviewUrls[index] = null;

        this.setState({
            orderedPhotoIdData: updatedPhotoIdData,
            orderedPreviewUrlsNeedUpdate: true,
            photoPicker: newPhotoPickerState,
            photoPickerCallerLocalId: null,
            orderedPreviewUrls: updatedOrderedPreviewUrls
        });
    }

    handlePhotoPickerClose = (event) => {
        event.preventDefault();

        let updatedPhotoPickerState = this.state.photoPicker;
        updatedPhotoPickerState.isOpen = false;
        this.setState({
            photoPicker: updatedPhotoPickerState,
            photoPickerCallerLocalId: null
        });
    }

    handlePhotoPickerOpen = (event, selectedItemLocalId) => {
        event.preventDefault();

        let updatedPhotoPickerState = this.state.photoPicker;
        updatedPhotoPickerState.isOpen = !updatedPhotoPickerState.isOpen;
        this.setState({ 
            photoPicker: updatedPhotoPickerState,
            photoPickerCallerLocalId: selectedItemLocalId
        });
    }

    mapPhotoIdInputs = (orderedPhotoIdDataList) => {
        const nullValuePlaceholder = '...';

        return orderedPhotoIdDataList.map((element, index) => {
            if(isValuelessFalsey(element.photoId)) { console.log('Display (and submission) must be able to compensate for entries without photos.'); }
            const arrayIndex = this.getIndexFromState(element.localId);
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }
            
            return (
                <Draggable draggableId={element.localId.toString()} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ordered-photo-edits" ref={provided.innerRef}>
                            <label>Photo {arrayIndex + 1}/{orderedPhotoIdDataList.length}</label>
                            <br />
                            <label>ID: { isValuelessFalsey(element.photoId) === true ? nullValuePlaceholder : element.photoId }</label>
                            <br />
                            { this.renderPhotoControl(element, this.props.imageDisplaySize) }
                            { this.state.orderedPhotoIdData.length > 1 &&
                                <button 
                                    className="delete-item" 
                                    onClick={(event) => this.handleDeletePhotoIdData(event, arrayIndex, isValuelessFalsey(element.photoId))}
                                >
                                    Remove
                                </button>
                            }
                        </li>
                    )}
                </Draggable>
            );
        });
    }

    onDragEnd = (result) => {
        if(!result.destination) { return; }

        let newOrderedPhotoIdData = this.state.orderedPhotoIdData.slice();
        let newOrderedPreviewUrls = this.state.orderedPreviewUrls.slice();

        const movedIdData = newOrderedPhotoIdData.splice(result.source.index, 1)[0];
        const movedUrlData = newOrderedPreviewUrls.splice(result.source.index, 1)[0];

        newOrderedPhotoIdData.splice(result.destination.index, 0, movedIdData);
        newOrderedPreviewUrls.splice(result.destination.index, 0, movedUrlData);

        this.setState({ 
            orderedPhotoIdData: newOrderedPhotoIdData,
            orderedPreviewUrls: newOrderedPreviewUrls 
        });
    }

    renderPhotoControl = (photoIdData, photoUploaderVersionName) => {
        if(!photoIdData || !this.props.imageDisplaySize) { return; }

        const hasPhotoId = isValuelessFalsey(photoIdData.photoId) === false;
        const localId = photoIdData.localId;

        const photo = <VersionedPhoto 
            uploadedFileData={this.state.orderedPreviewUrls[this.getIndexFromState(localId)]}
            uploadedFileVersionName={photoUploaderVersionName}
            targetClassName={`chosen-photo${hasPhotoId === false ? " placeholder" : ""}`}
            textDisplayForNoPhoto="(No photo chosen)"
        />;

        return (
            <Fragment>
                {photo}
                <button onClick={(event) => this.handlePhotoPickerOpen(event, localId)}>
                    { hasPhotoId === true ? 'Change' : 'Select' }
                </button>
            </Fragment>
        );
    }

    updatePreviewUrls = () => {
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
            // [NOTE] This currently assumes that 'targetData' and res.data.data are the same length

            const resData = res.data.data.map((element) => { 
                return BackendConstants.uploaders.safelyGetUploader('photo').getUrlForVersion(element.attributes.file, this.props.imageDisplaySize);
            });
            let orderedUrls = orderedPreviewUrls.slice();

            for(let i = 0; i < orderedPhotoIdData.length; i++) {
                let indexInRes = targetData.findIndex((element) => element.localId === orderedPhotoIdData[i].localId);
                if(indexInRes !== -1) { orderedUrls[i] = resData[indexInRes]; }
            }

            this.setState({
                orderedPreviewUrls: orderedUrls,
                orderedPreviewUrlsNeedUpdate: false
            });
        })
        .catch(err => console.log(err));
    }

    updateStateOfPhotoPicker = (newValue, propertyName) => {
        let newPhotoPickerState = this.state.photoPicker;
        newPhotoPickerState[propertyName] = newValue;
        this.setState({ photoPicker: newPhotoPickerState });
    }

    componentDidMount () {
        console.log('When there are blank entries, have a display message at bottom and disable submit button');
        console.log('When there are duplicate entries, have a display message at bottom and disable submit button');
        console.log('Except when all entries are blank, then page will ask you if you are okay clearing entire list to have no entries');

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
                    { hasOrderedPhotoIdState === true && 
                        <Fragment>
                            { this.state.photoPicker.isOpen === false
                            ?
                                <Fragment>
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <Droppable droppableId="photo-id-editor">
                                            { (provided) => (
                                                <ul {...provided.droppableProps} className="photo-id-editor" ref={provided.innerRef}>
                                                    { this.mapPhotoIdInputs(this.state.orderedPhotoIdData) }
                                                    { provided.placeholder }
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                    <br /> 
                                    <button onClick={this.handleAddPhotoIdData}>+</button>
                                    <br/>
                                    <button disabled={hasUnsavedChanges === false} type="submit">Update</button>
                                    <UnsavedChangesDisplay hasUnsavedChanges={hasUnsavedChanges} />
                                </Fragment>
                            :
                                <PhotoPicker 
                                    changeSelectedPhotoId={(newValue) => this.updateStateOfPhotoPicker(newValue, 'selectedPhotoId')}
                                    selectedPhotoId={this.state.photoPicker.selectedPhotoId}
                                    handleCancelForExport={this.handlePhotoPickerClose}
                                    handleUsePhotoForExport={this.handlePhotoIdDataChange}
                                    uploaderNamePrefix={'photo'}
                                />
                            }
                        </Fragment>
                    }
                </form>
            </div>
        )
    }
}

export default PhotoGalleryPageForm
