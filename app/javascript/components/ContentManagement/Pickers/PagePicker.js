import React, { Fragment } from 'react'

function PagePicker (props) {
    const { allPageNames, changePageSection, closePageSection, dashboardContext, pageSectionIsOpen, selectedPageSection } = props;

    const handleChangeOrClose = (event, action) => {
        event.preventDefault();
        if(dashboardContext?.unsavedChanges !== true) { action(); }
        else { window.alert("Your form has unsaved data. You must close it before you can exit this manager."); }
    }

    const mapPageButtons = () => {
        const isOpenPage = (pageName) => { return (pageSectionIsOpen === true && allPageNames[selectedPageSection] === pageName) };

        return allPageNames.map((value, index) => {
            return (
                <button disabled={isOpenPage(value) === true} key={value} onClick={(event) => handleChangeOrClose(event, () => changePageSection(index))}>
                    {value}
                </button>
            );
        });
    }

    return (
        <div className="page-picker">
        <div>Manage Page Resources:</div>
        <Fragment>{ mapPageButtons() }</Fragment>
        { pageSectionIsOpen === true &&
            <button onClick={(event) => handleChangeOrClose(event, closePageSection)}>Close</button>
        }
        </div>
    )
}

export default PagePicker
