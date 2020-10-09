import React from 'react'

class ContentManagerHome extends React.Component {
    constructor () {
        super();
        this.state = ({
            contentSectionOpen: true,
            selectedContentSecion: 0
        });
    }

    changeTab = () => { // rename 'tab'

    }

    render() {
        return (
            <div className="content-manager-home">
                <p>[ContentManagerHome Component]</p>
            </div>
        )
    }
}

export default ContentManagerHome
