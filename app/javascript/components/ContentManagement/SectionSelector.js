import React, { Fragment } from 'react'

class SectionSelector extends React.Component {
    constructor () {
        super();
        this.state = ({
            contentSectionOpen: false,
            selectedContentSection: 0
        });
    }

    render() {
        return (
            <div className="section-selector">
                <h1>SECTION SELECTOR</h1>
            </div>
        )
    }
}

export default SectionSelector
