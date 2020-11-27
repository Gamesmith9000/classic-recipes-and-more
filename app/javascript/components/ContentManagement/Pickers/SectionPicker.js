import React, { Fragment } from 'react'
import { ContentSectionsInfo } from '../../Utilities/ComponentHelpers';

function SectionPicker (props) {
    const sectionsInfo = ContentSectionsInfo.sections.slice();

    const mapSections = () => {       
        return ContentSectionsInfo.sections.map((value, index) => {
            const isOpenSection = props.contentSectionOpen === true && sectionsInfo[props.selectedContentSection].name === value.name;

            return (
                <button disabled={isOpenSection === true} key={value.name} onClick={() => props.changeContentSection(index)}>
                    {value.name}
                </button>
            );
        });
    }

    return (
        <div className="section-picker">
            <div>Manage Resource:</div>
            <Fragment>{ mapSections() }</Fragment>
            { props.contentSectionOpen === true &&
                <button onClick={props.closeContentSection}>Close</button>
            }
        </div>
    )
}

export default SectionPicker
