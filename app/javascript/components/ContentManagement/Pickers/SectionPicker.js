import React, { Fragment } from 'react'

function SectionPicker (props) {
    const { allSectionNames, changeContentSection, contentSectionOpen, closeContentSection, selectedContentSection } = props;
    
    const mapSectionButtons = () => {
        const isOpenSection = (sectionName) => { return (contentSectionOpen === true && allSectionNames[selectedContentSection] === sectionName) };

        return allSectionNames.map((value, index) => {
            return (
                <button disabled={isOpenSection(value) === true} key={value} onClick={() => changeContentSection(index)}>
                    {value}
                </button>
            );
        });
    }

    return (
        <div className="section-picker">
            <div>Manage Resource:</div>
            <Fragment>{ mapSectionButtons() }</Fragment>
            { contentSectionOpen === true &&
                <button onClick={closeContentSection}>Close</button>
            }
        </div>
    )
}

export default SectionPicker
