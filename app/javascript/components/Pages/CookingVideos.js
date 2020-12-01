import axios from 'axios'
import React, { Fragment } from 'react'
import { EmbeddedYoutubeVideo } from '../Utilities/ComponentHelpers'
import { setAxiosCsrfToken } from '../Utilities/Helpers'

class CookingVideos extends React.Component {
    constructor () {
        super();
        this.state = {
            videoData: null
        }
    }

    componentDidMount () {
        const options = {
            max: 5
        }
        axios.get('/api/v1/youtube_video_data.json', options)
        .then(res => {
            this.setState({videoData: res.data});
        })
        .catch(err => {
            console.log(err);
        })

    }

    mapVideos = (videoDataArray) => {
        return videoDataArray.map((item) => {
            return <EmbeddedYoutubeVideo key={item.id} youtubeVideoId={item.id} />;
        });
    }

    render() {
        return (
            <div className="cooking-videos">
                <p>[CookingVideos Component]</p>
                {this.state.videoData && this.state.videoData.length > 0 &&
                    <Fragment>{this.mapVideos(this.state.videoData)}</Fragment>
                }
            </div>
        )
    }
}

export default CookingVideos
