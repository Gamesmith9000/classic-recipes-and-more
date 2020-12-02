import React from 'react'
import axios from 'axios'
import qs from 'qs'

class PhotoGallery extends React.Component {
    constructor () {
        super();
        this.state = { orderedPhotoData: null };
    }

    // [NOTE][HARD-CODED] The photo version's value is hard coded into this component

    mappedPhotos = (photoVersion) => {
        return this.state.orderedPhotoData.map((element) => {
            const url = element.file[photoVersion]?.url;
            if(!url) { return; }
            
            return (
                <li className="photo" key={element.id}>
                    <img src={url} />
                </li>
            );
        });
    }

    renderPreviewPhoto(recipeData) {
        const photoId = recipeData?.preview_photo_id;
        if(isValuelessFalsey(photoId) === true){ return; }

        const index = this.state.photoData.findIndex((element) => element.photoId === photoId);
        if(index === -1) { return; }
        const url = this.state.photoData[index].photoUrl;

        return <img src={url} />;
    }

    componentDidMount () {
        axios.get('api/v1/aux/main.json')
        .then(res => {         
            let config = {
                params: { photos: { ids: res.data.data.attributes.photo_page_ordered_ids } },
                paramsSerializer: (params) => { return qs.stringify(params); }
            }

            axios.get('/api/v1/photos/multi.json', config)
            .then(res => {
                this.setState({
                    orderedPhotoData: res.data.data.map((element)=> {
                        const { id,  attributes: { file } } = element;
                        return { id, file };
                    })
                });
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="photo-gallery">
                <h1>Photo Gallery</h1>
                { this.state.orderedPhotoData &&
                    <ul className="photos-list">{ this.mappedPhotos('medium') }</ul>
                }
            </div>
        )
    }
}

export default PhotoGallery
