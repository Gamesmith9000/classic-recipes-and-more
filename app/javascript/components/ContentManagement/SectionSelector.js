import React, { Fragment } from 'react'

class SectionSelector extends React.Component {
    constructor () {
        super();
    }

    sectionButton = (sectionNumber, buttonText) => {
        return(
            <button onClick={() => this.props.changeContentSection(sectionNumber)}>
                {buttonText}
            </button>
        );
    }

    render() {
        return (
            <div className="section-selector">
                <div>Manage Resource:</div>
                <Fragment>
                    {this.sectionButton(0, "Pages")}
                    {this.sectionButton(1, "Recipes")}
                    {this.sectionButton(2, "Photos")}
                </Fragment>
            </div>
        )
    }
}

export default SectionSelector
