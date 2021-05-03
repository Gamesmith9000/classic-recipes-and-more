import axios from 'axios'
import React, { Fragment } from 'react'
import qs from 'qs'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import NestedPhotoPicker from '../Pickers/NestedPhotoPicker'

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
            orderedPhotoIdData: [],
            orderedPreviewUrls: [],
            orderedPreviewUrlsNeedUpdate: false,
            priorOrderedPhotoIdData: [],
            photoPicker: new ExportedPhotoPickerState(false, 0, null, null),
        }
    }

    getIndexFromState = (localId) => {
        for(let i = 0; i < this.state.orderedPhotoIdData.length; i++) {
            if(this.state.orderedPhotoIdData[i]?.localId === localId) { return i; }
        }
        return -1;
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

    handlePhotoChosen = (photoData) => {
        const selectedPhotoId = parseInt(photoData.id);
        const { nextUniqueLocalId } = this.state;
        const newPhotoPickerState = new ExportedPhotoPickerState(false, null, null, null);

        const updatedPhotoIdData = this.state.orderedPhotoIdData.slice();
        updatedPhotoIdData.push(new PhotoGalleryPageFormPhotoInfo(nextUniqueLocalId, selectedPhotoId));

        const updatedOrderedPreviewUrls = this.state.orderedPreviewUrls.slice();
        updatedOrderedPreviewUrls.push(null);

        this.setState({
            nextUniqueLocalId: nextUniqueLocalId + 1,
            orderedPhotoIdData: updatedPhotoIdData,
            orderedPreviewUrlsNeedUpdate: true,
            photoPicker: newPhotoPickerState,
            orderedPreviewUrls: updatedOrderedPreviewUrls
        });
    }

    handlePhotoPickerClose = (event) => {
        event.preventDefault();

        const updatedPhotoPickerState = this.state.photoPicker;
        updatedPhotoPickerState.isOpen = false;
        this.setState({ photoPicker: updatedPhotoPickerState });
    }

    handlePhotoPickerOpen = (event) => {
        event.preventDefault();

        const updatedPhotoPickerState = this.state.photoPicker;
        updatedPhotoPickerState.isOpen = !updatedPhotoPickerState.isOpen;
        this.setState({ photoPicker: updatedPhotoPickerState });
    }

    initializeComponentStateFromResponse = (res) => {
        const photoPageOrderedIds = res.data.data.attributes.photo_page_ordered_ids;

        if(photoPageOrderedIds && photoPageOrderedIds.length > 0) {
            this.setState({
                nextUniqueLocalId: photoPageOrderedIds.length, 
                orderedPhotoIdData: photoPageOrderedIds.map((element, index) => (new PhotoGalleryPageFormPhotoInfo(index, element))),
                orderedPreviewUrls: new Array(photoPageOrderedIds.length),
                orderedPreviewUrlsNeedUpdate: true,
                priorOrderedPhotoIdData: photoPageOrderedIds.map((element, index) => (new PhotoGalleryPageFormPhotoInfo(index, element)))
            });
        }
    }

    mapPhotoIdInputs = (orderedPhotoIdDataList) => {
        const soleListItem = this.state.orderedPhotoIdData.length === 1;
        const nullValuePlaceholder = '...';

        return orderedPhotoIdDataList.map((element, index) => {
            const arrayIndex = this.getIndexFromState(element.localId);
            if(isValuelessFalsey(arrayIndex) === true || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={element.localId.toString()} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ordered-photo-edits" ref={provided.innerRef}>
                            <div>{arrayIndex + 1}/{orderedPhotoIdDataList.length}</div>
                            <div>Photo ID: { isValuelessFalsey(element.photoId) === true ? nullValuePlaceholder : element.photoId }</div>
                            { this.renderPhotoControl(element, this.props.imageDisplaySize) }
                            <button 
                                className="delete-item" 
                                disabled={soleListItem === true && isValuelessFalsey(element.photoId) === true}
                                onClick={(event) => this.handleDeletePhotoIdData(event, arrayIndex, isValuelessFalsey(element.photoId))}
                            >
                                Remove
                            </button>
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
        if(!photoIdData || !this.props.imageDisplaySize) {
            console.warn('imageDisplaySize prop is required to render photo controls. Example: imageDisplaySize="small"')
            return; 
        }

        const hasPhotoId = isValuelessFalsey(photoIdData.photoId) === false;
        const localId = photoIdData.localId;

        const photo = <VersionedPhoto 
            uploadedFileData={this.state.orderedPreviewUrls[this.getIndexFromState(localId)]}
            uploadedFileVersionName={photoUploaderVersionName}
            targetClassName={`chosen-photo${hasPhotoId === false ? " placeholder" : ""}`}
            textDisplayForNoPhoto="(No photo chosen)"
        />;

        return <div>{photo}</div>
    }

    updatePreviewUrls = () => {
        const { orderedPhotoIdData, orderedPreviewUrls, orderedPreviewUrlsNeedUpdate } = this.state;
        if(orderedPreviewUrlsNeedUpdate !== true) { return; }

        let targetData = [];
        for(let i = 0; i < orderedPhotoIdData.length; i++) {
            const hasPhotoId = (isValuelessFalsey(orderedPhotoIdData[i].photoId) === false);
            const missingUrl = (isValuelessFalsey(orderedPreviewUrls[i]) === true || orderedPreviewUrls[i] === '');
            
            if(hasPhotoId === true && missingUrl === true) {
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

    componentDidMount () {
        axios.get('/api/v1/aux/main.json')
        .then(res => this.initializeComponentStateFromResponse(res))
        .catch(err => console.log(err));
    }

    render() {
        const hasUnsavedChanges = objectsHaveMatchingValues(this.state.orderedPhotoIdData, this.state.priorOrderedPhotoIdData) === false;
        if(this.state.orderedPreviewUrlsNeedUpdate === true) { this.updatePreviewUrls(); }

        return (
            <div className="photo-gallery-page-editor">
                <h2>Editing "Photo Gallery" Page</h2>
                <form className="photo-gallery-page-form" onSubmit={this.handleFormSubmit}>
                    <h3>Ordered Photos</h3>
                    { this.state.orderedPhotoIdData && 
                        <Fragment>
                            { this.state.photoPicker.isOpen === false
                            ?
                                <Fragment>
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <Droppable droppableId="photo-id-editor" direction="horizontal">
                                            { (provided) => (
                                                <ul {...provided.droppableProps} className="photo-id-editor" ref={provided.innerRef}>
                                                    { this.mapPhotoIdInputs(this.state.orderedPhotoIdData) }
                                                    { provided.placeholder }
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                    <br /> 
                                    <button onClick={this.handlePhotoPickerOpen}>+</button>
                                    <br/>
                                    <button disabled={hasUnsavedChanges === false} type="submit">Update</button>
                                    <UnsavedChangesDisplay hasUnsavedChanges={hasUnsavedChanges} />
                                </Fragment>
                            :
                                <NestedPhotoPicker 
                                    containingResourceName="gallery"
                                    onCancelAndExit={this.handlePhotoPickerClose}
                                    onPhotoChosenForExport={photoData => this.handlePhotoChosen(photoData)}
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
