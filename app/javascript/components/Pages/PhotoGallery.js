import React from 'react'
import axios from 'axios'
import qs from 'qs'

import VersionedPhoto from '../Misc/VersionedPhoto'

class PhotoGallery extends React.Component {
    constructor () {
        super();
        this.state = { orderedPhotoData: null };
    }

    mappedPhotos = () => {
        const { photoVersion } = this.props;
        return this.state.orderedPhotoData.map((element) => {
            return (
                <VersionedPhoto 
                    key={element.id}
                    uploadedFileData={element.file}
                    uploadedFileVersionName={photoVersion}
                    renderNullWithoutUrl={true}
                    targetClassName="photo"
                />
            );
        });
    }

    componentDidMount () {
        axios.get('api/v1/aux/main.json')
        .then(res => {
            console.warn("AuxData's photo_page_ordered_ids attribute has been phased out");
            return;
            
            const photoPageOrderedIds = res.data.data.attributes.photo_page_ordered_ids;
            if(!photoPageOrderedIds || photoPageOrderedIds.length < 1) { return; }
            
            let config = {
                params: { photos: { ids: photoPageOrderedIds } },
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
                    <ul className="photos-list">{ this.mappedPhotos() }</ul>
                }
            </div>
        )
    }
}

export default PhotoGallery
