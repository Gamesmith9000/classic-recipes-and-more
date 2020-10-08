import React from 'react'
import axios from 'axios'

class About extends React.Component {
    constructor () {
        super();
        this.state = {
            sections: []
        }
    }

    componentDidMount () {
        axios.get('/api/v1/aux/main.json')
        .then(res => {
            this.setState({
                sections: res.data.data.attributes.about_page_sections,
            });
        })
        .catch(err => console.log(err));
    }

    mapSections = (sectionsList) => {
        return sectionsList.map((item, index) => {
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
                    {this.mapSections(this.state.sections)}
                </div>
            </div>
        )
    }
}

export default About
