import React from 'react'

class PhotoGallery extends React.Component {
    constructor () {
        super();
        this.state = {
            
        };
    }

    componentDidMount () {
        // api/v1/photos/multi

        // axios.get()
        // .then(res => {
        //     console.log(res);
        // })
        // .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="photo-gallery">
                <p>[PhotoGallery Component]</p>
            </div>
        )
    }
}

export default PhotoGallery
