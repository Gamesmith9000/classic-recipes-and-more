import React, { Fragment } from 'react'
import axios from 'axios'
import { BackendConstants } from '../../../Helpers'
import { EmptyPickerEntriesDisplay} from '../../../ComponentHelpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../../ResponseDataHelpers'

class PhotoPicker extends React.Component {
    // [NOTE] This logic was ported from RecipePicker component. Attempt to find a more DRY implementation

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
            const isSelected = (this.props.selectedPhotoId && this.props.selectedPhotoId === parseInt(item.id));
            const commonItems = (
                <Fragment>
                    <div className="id-column">ID: {item.id}</div>
                    <img src={item.attributes.file.thumb.url} />
                    <div>Title: {item.attributes.title}</div>
                    <div>Tag: {item.attributes.tag}</div>
                </Fragment>
            );
            if(isSelected === true) {
                return (
                <li 
                    className="photo-preview selected" 
                    key={index}
                >
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
                    key={index}
                    onClick={(event) => this.handlePhotoPreviewSelect(event, item.id)}
                >
                    { commonItems }
                </li>
            );
        });
        // [NOTE] Consider changing li key to something other than index.

        return (
            <ul className="photo-previews-list">{mappedPhotoPreview}</ul>
        );
    }

    mapSortSelectAttributeOptions = () => {
        return this.state.sorting?.validFields?.map((item) => {
            return (
                <option key={`map-sortSelectField-photo-${item}`} value={item}>
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
        axios.get('/api/v1/photos')
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
                {(!this.state.photoData || this.state.photoData.length === 0)
                    ? 
                        <EmptyPickerEntriesDisplay entryTypeName='photo' />
                    :
                    <Fragment>
                        { this.mapPhotoPreviews(this.state.photoData) }
                        { this.renderSortSelect() }
                    </Fragment> 
                }
            </div>
        )
    }
}

export default PhotoPicker
