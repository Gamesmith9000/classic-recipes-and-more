import React from 'react'
import axios from 'axios'

class About extends React.Component {
    constructor () {
        super();
        this.state = {
            paragraphs: []
        }
    }

    componentDidMount () {
        axios.get('/api/v1/aux/main.json')
        .then(res => {
            this.setState({
                paragraphs: res.data.data.attributes.about_page_paragraphs,
            });
        })
        .catch(err => console.log(err));
    }

    mapParagraphs = (paragraphsList) => {
        return paragraphsList.map((item, index) => {
            return (
                <p key={index}>
                    {item}
                </p>
            )
        });
    }

    render() {
        return (
            <div className="about">
                <h1>About Us</h1>
                <div className="about-story">
                    {this.mapParagraphs(this.state.paragraphs)}
                </div>
            </div>
        )
    }
}

export default About
