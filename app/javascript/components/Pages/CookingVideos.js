import React, { Fragment } from 'react'
import axios from 'axios'
import { embedYoutubeVideo } from '../../ComponentHelpers'
import { setAxiosCsrfToken } from '../../Helpers'

class CookingVideos extends React.Component {
    constructor () {
        super();
        this.state = {
            videoData: null
        }
    }

    componentDidMount () {
        setAxiosCsrfToken();

        const options = {
            max: 5
        }
        axios.get('/api/v1/get_youtube_video_data.json', options)
        .then(res => {
            console.log(res.data);
            this.setState({videoData: res.data});
        })
        .catch(err => {
            console.log(err);
        })

    }

    mapVideos = (videoDataArray) => {
        const mappedVideos = videoDataArray.map( (item, index) => {
            return(
                <div className="video-frame" key={index}>
                    {embedYoutubeVideo(item.id)}
                </div>
            );
        });
        
        return mappedVideos;
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
