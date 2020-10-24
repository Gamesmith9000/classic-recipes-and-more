import React, { Fragment } from 'react'
import { ContentSectionsInfo } from '../../ComponentHelpers';

class SectionSelector extends React.Component {
    //  [NOTE] This will need to be refactored (and renamed) into a 'picker'

    constructor () {
        super();
    }

    mapSections = () => {
        const changeContent = this.props.changeContentSection;
        
        return ContentSectionsInfo.sections.map(function(value, index) {
            return(
                <button 
                    key={index}
                    onClick={() => changeContent(index)}>
                    {value.name}
                </button>
            );
        })
        // [NOTE] Consider changing key to something other than index.
    }

    render() {
        return (
            <div className="section-selector">
                <div>Manage Resource:</div>
                <Fragment>
                    {this.mapSections()}
                </Fragment>
            </div>
        )
    }
}

export default SectionSelector
