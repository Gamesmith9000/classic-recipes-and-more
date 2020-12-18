import axios from 'axios'
import React, { Fragment } from 'react'

import { EmptyPickerEntriesDisplay, VersionedPhoto} from '../../Utilities/ComponentHelpers'
import { BackendConstants, isValuelessFalsey } from '../../Utilities/Helpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../Utilities/ResponseDataHelpers'

class PhotoPicker extends React.Component {
    // [NOTE][OPTIMIZE] Important: This component has no caching for api calls. This is a crucial place for optimization.
    //                   this might even require the helper of higher up components & their state

    // [NOTE] Important: tag filtering has not yet been implemented

    constructor () {
        super();
        this.state = {
            photoData: null,
            sorting: {
                byId: true,
                fieldIndex: 0,
                ignoredFields: ['file'],
                validFields: []
            },
            tagFiltering : {
                enabled: false,
                filteredPhotoIds: [],
                tag: BackendConstants.models.photo.defaults.tag
            }
        }
    }

    handlePhotoPreviewSelect = (event, photoId) => {
        event.preventDefault();
        this.props.changeSelectedPhotoId(parseInt(photoId));
        if(this.props.changeSelectedPhotoUrl) {
            const entry = this.state.photoData.find(element => parseInt(element.id) === parseInt(photoId));
            const photoUrl = entry ? BackendConstants.photoUploader.getUrlForVersion(entry.attributes?.file, this.props.exportedPhotoUrlVersion) : null;
            this.props.changeSelectedPhotoUrl(photoUrl);
        }
    }

    handleSortSelectInputChange = (event) => {
        event.preventDefault();
        if(!this.state.sorting) { return; }
        const newValue = event.target.value;

        if(newValue === 'id') {
            let sortingState = this.state.sorting;
            sortingState.byId = true;

            this.setState({ sorting: sortingState });
        }
        else {
            if(this.state.sorting.validFields.includes(newValue)) {
                let sortingState = this.state.sorting;
                sortingState.byId = false;
                sortingState.fieldIndex = this.state.sorting.validFields.indexOf(newValue);

                this.setState({ sorting: sortingState });
            }
        }
    }

    mapPhotoPreviews = (photoDataList) => {
        if(!photoDataList || !this.state.sorting) return;
        
        const { byId, fieldIndex, validFields} = this.state.sorting;
        const sortedPhotoDataList = sortByAttributeNameOrId(photoDataList, validFields, fieldIndex, byId);

        const mappedPhotoPreview = sortedPhotoDataList.map((item, index) => {
            const isSelected = (isValuelessFalsey(this.props.selectedPhotoId) === false && this.props.selectedPhotoId === parseInt(item.id));

            const commonItems = (
                <Fragment>
                    <div className="id-column">ID: {item.id}</div>
                    <VersionedPhoto 
                        photoFileData={item.attributes.file}
                        photoVersionName={this.props.photoPickerPhotoVersion}
                    />
                    <div>Title: {item.attributes.title}</div>
                    <div>Tag: {item.attributes.tag}</div>
                </Fragment>
            );
            if(isSelected === true) {
                return (
                <li className="photo-preview selected" key={item.id} >
                    <div className='selected-preview-item-buttons'>
                        { this.props.handleModifyPhotoButtonInput && this.props.handleDeletePhotoButtonInput && 
                            <Fragment>
                                <button onClick={this.props.handleModifyPhotoButtonInput}>
                                    Modify
                                </button>
                                <button onClick={this.props.handleDeletePhotoButtonInput}>
                                    Delete
                                </button>
                            </Fragment>
                        }
                        { this.props.handleUsePhotoForExport &&
                            <button onClick={this.props.handleUsePhotoForExport}>
                                Use
                            </button>
                        }
                        <button onClick={(event) => this.handlePhotoPreviewSelect(event, null)}>
                            Cancel
                        </button>
                    </div>
                    { commonItems }
                </li>
                );
            }

            return (
                <li 
                    className="photo-preview" 
                    key={item.id}
                    onClick={(event) => this.handlePhotoPreviewSelect(event, item.id)}
                >
                    { commonItems }
                </li>
            );
        });

        return (
            <ul className="photo-previews-list">{ mappedPhotoPreview }</ul>
        );
    }

    mapSortSelectAttributeOptions = () => {
        return this.state.sorting?.validFields?.map((item) => {
            return (
                <option key={item} value={item}>
                    { item.charAt(0).toUpperCase() + item.slice(1) }
                </option>
            );
        }); 
    }

    renderSortSelect = () => {
        return (
            <Fragment>
                <label htmlFor="photo-sort-select">Sort By: </label>
                <select 
                    id="photo-sort-select"
                    onChange={this.handleSortSelectInputChange} 
                >
                    <option value="id">ID</option>
                    { this.mapSortSelectAttributeOptions() }
                </select>
            </Fragment>
        );
    }

    componentDidMount () {
        axios.get('/api/v1/photos.json')
        .then(res => {
            let sortingState = this.state.sorting;
            sortingState.validFields = getSortablePropertyNamesFromAttributes(res.data.data, sortingState.ignoredFields)
            this.setState({ 
                photoData: res.data.data,
                sorting: sortingState
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="photo-picker">
                { this.props.handleUsePhotoForExport &&
                    <Fragment>
                        <h3>Select a Photo:</h3>
                        { this.props.handleCancelForExport &&
                            <Fragment>
                                <button onClick={this.props.handleCancelForExport}>
                                    Cancel
                                </button>
                                <br/>
                                <br/>
                            </Fragment>
                        }
                    </Fragment>
                }
                { (!this.state.photoData || this.state.photoData.length === 0)
                    ? 
                        <EmptyPickerEntriesDisplay entryTypeName='photo' />
                    :
                        <Fragment>
                            { this.renderSortSelect() }
                            { this.mapPhotoPreviews(this.state.photoData) }
                        </Fragment> 
                }
            </div>
        )
    }
}

export default PhotoPicker
