import React, { Fragment } from 'react'

function ContentSectionPicker (props) {
    const { allSectionNames, changeContentSection, dashboardContext, contentSectionIsOpen, closeContentSection, selectedContentSection } = props;

    const handleChangeOrClose = (event, action) => {
        event.preventDefault();
        if(dashboardContext?.unsavedChanges !== true) { action(); }
        else { window.alert("Your form has unsaved data. You must close it before you can exit this manager."); }
    }

    const mapSectionButtons = () => {
        const isOpenSection = (sectionName) => { return (contentSectionIsOpen === true && allSectionNames[selectedContentSection] === sectionName) };

        return allSectionNames.map((value, index) => {
            return (
                <button disabled={isOpenSection(value) === true} key={value} onClick={(event) => handleChangeOrClose(event, () => changeContentSection(index))}>
                    {value}
                </button>
            );
        });
    }

    return (
        <div className="section-picker">
            <div>Manage Resource:</div>
            <Fragment>{ mapSectionButtons() }</Fragment>
            { contentSectionIsOpen === true &&
                <button onClick={(event) => handleChangeOrClose(event, closeContentSection)}>Close</button>
            }
        </div>
    )
}

export default ContentSectionPicker