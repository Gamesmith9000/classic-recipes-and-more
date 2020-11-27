import React, { Fragment } from 'react'
import { ContentSectionsInfo } from '../../Utilities/ComponentHelpers';

function SectionPicker (props) {
    const mapSections = () => {       
        return ContentSectionsInfo.sections.map((value, index) => {
            return(
                <button key={value.name} onClick={() => props.changeContentSection(index)}>
                    {value.name}
                </button>
            );
        });
    }

    return (
        <div className="section-picker">
            <div>Manage Resource:</div>
            <Fragment>{ mapSections() }</Fragment>
        </div>
    )
}

export default SectionPicker
