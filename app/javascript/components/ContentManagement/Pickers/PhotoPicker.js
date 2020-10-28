import React, { Fragment } from 'react'
import axios from 'axios'

class PhotoPicker extends React.Component {
    // [NOTE] This logic was ported from RecipePicker component. Attempt to find a more DRY implementation

    constructor () {
        super();
        this.state = {
            photoData: null,
            sortById: true
        }
    }

    handlePhotoPreviewSelect = (event, photoId) => {
        event.preventDefault();
        this.props.changeSelectedPhotoId(parseInt(photoId));
    }

    handleSortingButtonPress = (event) => {
        event.preventDefault();
        this.setState({
            sortById: !this.state.sortById
        });
    }

    mapPhotoPreviews = (photoDataList) => {
        if(!photoDataList) return;
        
        const sortedPhotoDataList = this.sortPhotoData(photoDataList);
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

    sortPhotoData = (photoData) => {
        if(this.state.sortById === true) {
            return photoData.sort(function(a,b) {
                const aId = parseInt(a.id);
                const bId = parseInt(b.id);
                
                if(aId === bId) {
                    return 0;
                }
                if(aId < bId) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
        else {
            return photoData.sort(function(a,b) {
                const aName = a.attributes.title.toUpperCase();
                const bName = b.attributes.title.toUpperCase();
                
                if(aName === bName) {
                    return 0;
                }
                if(aName < bName) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
    }

    componentDidMount () {
        axios.get('/api/v1/photos')
        .then(res => {
            this.setState({
                photoData: res.data.data
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="photo-picker">
                <div className="sorting-controls">
                    <div>Sorting By:</div>
                    <button onClick={this.handleSortingButtonPress}>
                        {this.state.sortById === true  ? "ID" : "Title"}
                    </button>
                </div>
                {this.mapPhotoPreviews(this.state.photoData)}
            </div>
        )
    }
}

export default PhotoPicker
