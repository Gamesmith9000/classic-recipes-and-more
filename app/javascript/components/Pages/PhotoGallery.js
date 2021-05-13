import React from 'react'
import axios from 'axios'

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
                    key={`gallery-photo-${element.id}`}
                    uploadedFileData={element.file}
                    uploadedFileVersionName={photoVersion}
                    renderNullWithoutUrl={true}
                    targetClassName="photo"
                />
            );
        });
    }

    componentDidMount () {
        axios.get('api/v1/aux/ordered_photos.json')
        .then(res => {
            const mappedData = res.data.data.map(function(item){
                const photoId = item.relationships?.photo?.data?.id;
                const photoData = res.data?.included.find(element => element.id === photoId && element.type === 'photo');

                return {
                    id: item.id,
                    file: photoData?.attributes?.file
                }
            });

            this.setState({ orderedPhotoData: mappedData });
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
