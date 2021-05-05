import axios from 'axios'
import React, { Fragment } from 'react'
import qs, { parse } from 'qs'
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
            orderedPhotoData: [],
            priorOrderedPhotoData: [],
            photoPicker: new ExportedPhotoPickerState(false, 0, null, null),
        }
    }

    hasUnsavedChangesCheck = () => {
        return objectsHaveMatchingValues(this.state.orderedPhotoData, this.state.priorOrderedPhotoData) === false;
    }

    getIndexFromState = (localId) => {
        for(let i = 0; i < this.state.orderedPhotoData.length; i++) {
            if(this.state.orderedPhotoData[i]?.localId === localId) { return i; }
        }
        return -1;
    }

    handleDeletePhotoData = (event, sectionIndex, skipConfirmation = false) => {
        event.preventDefault();

        const confirmedClose = skipConfirmation === false 
        ? (window.confirm("Are you sure you want to remove this photo association?") === true)
        : true;

        if(confirmedClose === true) {
            let updatedPhotoData = this.state.orderedPhotoData.slice();
            updatedPhotoData.splice(sectionIndex, 1);
            this.setState({ orderedPhotoData: updatedPhotoData });
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

    handlePhotoChosen = (chosenPhotoData) => {
        const { nextUniqueLocalId } = this.state;
        const newPhotoPickerState = new ExportedPhotoPickerState(false, null, null, null);

        const updatedPhotoData = this.state.orderedPhotoData.slice();
        const newItem = {
            id: null,
            localId: nextUniqueLocalId,
            photoId: parseInt(chosenPhotoData.id),
            url: this.responseFileAttributeToUrl(chosenPhotoData.attributes.file)
        };

        updatedPhotoData.push(newItem);

        this.setState({
            nextUniqueLocalId: nextUniqueLocalId + 1,
            orderedPhotoData: updatedPhotoData,
            photoPicker: newPhotoPickerState,
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
        const orderedPhotos = res.data.included.filter(element => element.type === "ordered_photo");

        const mapOrderedPhotoData = function (element, index) {
            const newItem = {
                id: parseInt(element.id),
                localId: index,
                photoId: parseInt(element.relationships.photo.data.id),
                url: null
            };
            return newItem;
        }

        if(!orderedPhotos || orderedPhotos.length <= 0) { return; }

        const targetIds = orderedPhotos.map(mapOrderedPhotoData).map((value) => { return value.photoId; });
        const config = {
            params: { photos: { ids: targetIds } },
            paramsSerializer: (params) => { return qs.stringify(params); }
        }

        const newState = {
            nextUniqueLocalId: orderedPhotos.length, 
            orderedPhotoData: orderedPhotos.map(mapOrderedPhotoData),
            priorOrderedPhotoData: orderedPhotos.map(mapOrderedPhotoData),
        }

        axios.get('/api/v1/photos/multi.json', config)
        .then(photosRes => {
            for(let i = 0; i < newState.orderedPhotoData.length; i++) {
                const photoIndex = photosRes.data.data.findIndex(item => parseInt(item.id) === newState.orderedPhotoData[i].photoId);
                if(photoIndex > -1 && photosRes.data.data[photoIndex]) {
                    const url = this.responseFileAttributeToUrl(photosRes.data.data[i].attributes.file, this.props.imageDisplaySize);
                    newState.orderedPhotoData[i].url = url;
                    newState.priorOrderedPhotoData[i].url = url;
                }
            }
            this.setState(newState);
        })
        .catch(photosErr => {
            console.log(photosErr);
            this.setState(newState);
        });
    }

    mapPhotoInputs = () => {
        const orderedPhotoData = this.state.orderedPhotoData;

        return orderedPhotoData.map((element, index) => {
            const arrayIndex = this.getIndexFromState(element.localId);
            if(isValuelessFalsey(arrayIndex) === true || arrayIndex === -1) { return; }

            return (
                <Draggable draggableId={element.localId.toString()} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="ordered-photo-edits" ref={provided.innerRef}>
                            <div>{arrayIndex + 1}/{orderedPhotoData.length}</div>
                            { this.renderPhotoControl(element) }
                            <button 
                                className="delete-item" 
                                onClick={(event) => this.handleDeletePhotoData(event, arrayIndex, isValuelessFalsey(element.photoId))}
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

        const newOrderedPhotoData = this.state.orderedPhotoData.slice();
        const movedData = newOrderedPhotoData.splice(result.source.index, 1)[0];
        newOrderedPhotoData.splice(result.destination.index, 0, movedData);
        this.setState({ orderedPhotoData: newOrderedPhotoData });
    }

    renderPhotoControl = (photoData) => {
        if(!photoData || !this.props.imageDisplaySize) {
            console.warn('imageDisplaySize prop is required to render photo controls. Example: imageDisplaySize="small"')
            return; 
        }

        // Double check to see if all of these props are really necessary here
        const photo = <VersionedPhoto 
            uploadedFileData={photoData.url}
            uploadedFileVersionName={this.props.imageDisplaySize}
            targetClassName="chosen-photo"
        />;

        return <div>{photo}</div>
    }

    responseFileAttributeToUrl = (fileAttributeData, imageDisplaySize) => {
        const url = imageDisplaySize 
        ? fileAttributeData[imageDisplaySize]?.url 
        : fileAttributeData.url;
        return url;
    }

    componentDidMount () {
        axios.get('/api/v1/aux/main.json')
        .then(res => this.initializeComponentStateFromResponse(res))
        .catch(err => console.log(err));
    }

    render() {
        const hasUnsavedChanges = this.hasUnsavedChangesCheck();

        return (
            <div className="photo-gallery-page-editor">
                <h2>Editing "Photo Gallery" Page</h2>
                <form className="photo-gallery-page-form" onSubmit={this.handleFormSubmit}>
                    <h3>Ordered Photos</h3>
                    { this.state.orderedPhotoData && 
                        <Fragment>
                            { this.state.photoPicker.isOpen === false
                            ?
                                <Fragment>
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <Droppable droppableId="photo-id-editor" direction="horizontal">
                                            { (provided) => (
                                                <ul {...provided.droppableProps} className="photo-id-editor" ref={provided.innerRef}>
                                                    { this.mapPhotoInputs() }
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
