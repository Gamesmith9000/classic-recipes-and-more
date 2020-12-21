import axios from 'axios'
import React, { Fragment } from 'react'

import VersionedPhoto from '../../Misc/VersionedPhoto'
import { EmptyPickerEntriesDisplay} from '../../Utilities/ComponentHelpers'
import BackendConstants from '../../Utilities/BackendConstants'
import { isValuelessFalsey } from '../../Utilities/Helpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../Utilities/ResponseDataHelpers'
import { capitalCase, paramCase } from 'change-case'

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
        const parsedId = parseInt(photoId);
        
        this.props.changeSelectedPhotoId(isValuelessFalsey(photoId, false) === false ? parsedId: null);
        if(this.props.changeSelectedPhotoUrl) {
            const entry = this.state.photoData.find(element => parseInt(element.id) === parseInt(photoId));
            const photoUrl = isValuelessFalsey(entry) === false 
                ? BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).getUrlForVersion(entry.attributes?.file, this.props.exportedPhotoUrlVersion) 
                : null
            ;
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
        if(!photoDataList || !this.state.sorting) { return null; }
        
        const { byId, fieldIndex, validFields} = this.state.sorting;
        const sortedPhotoDataList = sortByAttributeNameOrId(photoDataList, validFields, fieldIndex, byId);
        const formattedName = paramCase(this.props.uploaderNamePrefix);

        const mappedPhotoPreview = sortedPhotoDataList.map((item, index) => {
            const isSelected = (isValuelessFalsey(this.props.selectedPhotoId) === false && this.props.selectedPhotoId === parseInt(item.id));

            const commonItems = (
                <Fragment>
                    <div className="id-column">ID: {item.id}</div>
                    <VersionedPhoto 
                        uploadedFileData={item.attributes.file}
                        uploadedFileVersionName={this.props.photoPickerPhotoVersion}
                        uploaderNamePrefix={this.props.uploaderNamePrefix}
                    />
                    <div>Title: {item.attributes.title}</div>
                    <div>Tag: {item.attributes.tag}</div>
                </Fragment>
            );
            if(isSelected === true) {
                return (
                <li className={`${formattedName}-preview selected`} key={item.id} >
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
                    className={`${formattedName}-preview`} 
                    key={item.id}
                    onClick={(event) => this.handlePhotoPreviewSelect(event, item.id)}
                >
                    { commonItems }
                </li>
            );
        });

        return (
            <ul className={`${formattedName}-previews-list`}>{ mappedPhotoPreview }</ul>
        );
    }

    mapSortSelectAttributeOptions = () => {
        return this.state.sorting?.validFields?.map((item) => {
            return <option key={item} value={item}>{ capitalCase(item) }</option>;
        }); 
    }

    renderSortSelect = () => {
        const id = paramCase(this.props.uploaderNamePrefix);

        return (
            <Fragment>
                <label htmlFor={id}>Sort By: </label>
                <select 
                    id={id}
                    onChange={this.handleSortSelectInputChange} 
                >
                    <option value="id">ID</option>
                    { this.mapSortSelectAttributeOptions() }
                </select>
            </Fragment>
        );
    }

    componentDidMount () {
        const resourceName = BackendConstants.uploaders.safelyGetUploader(this.props.uploaderNamePrefix).railsResourceName;

        axios.get(`/api/v1/${resourceName}s.json`)
        .then(res => {
            if(res.data.data.length > 0) {
                let sortingState = this.state.sorting;
                sortingState.validFields = getSortablePropertyNamesFromAttributes(res.data.data, sortingState.ignoredFields)
                this.setState({ 
                    photoData: res.data.data,
                    sorting: sortingState
                });
            }
        })
        .catch(err => console.log(err));
    }

    render() {
        const resourceName = this.props.uploaderNamePrefix;
        const targetClassName = paramCase(resourceName + '_picker');
        const displayName = capitalCase(resourceName);
        return (
            <div className={targetClassName}>
                { this.props.handleUsePhotoForExport &&
                    <Fragment>
                        <h3>{`Select a ${displayName}:`}</h3>
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
                        <EmptyPickerEntriesDisplay entryTypeName={resourceName} />
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
