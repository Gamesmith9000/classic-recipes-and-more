import React, { Fragment } from 'react'
import AdminUserDisplay from './Subcomponents/AdminUserDisplay'
import { existsInLocalStorage, objectsHaveMatchingValues } from '../Utilities/Helpers';
import ContentDashboardContext from './ContentDashboardContext'
import ContentOptionsContext from './ContentOptionsContext'
import ContentSectionManager from './Managers/ContentSectionManager';


class ContentDashboard extends React.Component {
    constructor () {
        super();
        this.state = ({
            contentContext: {
                photoPicker: {
                    exportedImageVersion: 'small',
                    standardImageVersion: 'small'
                }
            },
            dashboardContext: {
                unsavedChanges: false
            },
            componentHasMounted: false,
            contentSectionIsOpen: false,
            pageSectionIsOpen: false,
            selectedContentSection: 0,
            selectedPageSection: 0
        });
    }

    changeContentSection = (newSectionIdentifier) => {
        this.setState({
            contentSectionIsOpen: true,
            selectedContentSection: newSectionIdentifier
        });
    }

    changePageSection = (newSectionIdentifier) => {
        this.setState({
            pageSectionIsOpen: true,
            selectedPageSection: newSectionIdentifier
        });
    }
    
    closeContentSection = () => {
        this.setState({ contentSectionIsOpen: false });
    }

    closePageSection = () => {
        this.setState({ pageSectionIsOpen: false });
    }

    createNewStateToMatchLocalStorage = (changedMountedStateToTrue = false) => {
        const fields = Object.keys(this.persistantFields);
        const newState = {};

        for(let i = 0; i < fields.length; i++) {
            newState[fields[i]] = this.persistantFields[fields[i]].getValue();
        }

        if(changedMountedStateToTrue === true) { newState.componentHasMounted = true; }
        return { ...newState };
    }

    localStorageMatchesState = () => {
        const fields = Object.keys(this.persistantFields);
        const storageValues = {};
        const stateValues = {};

        for(let i = 0; i < fields.length; i++) {
            const field = fields[i];
            storageValues[field] = this.persistantFields[field]?.getValue();
            stateValues[field] = this.state[field];
        }

        return objectsHaveMatchingValues(stateValues, storageValues) === true;
    }

    persistantFields = {
        contentSectionIsOpen: {
            getValue () {
                const storedValue = localStorage.getItem('contentSectionIsOpen');
                if(storedValue === 'true' || storedValue === 'false') { return storedValue === 'true' ? true : false; }
                else { return null; }
            },
            hasValue () { return existsInLocalStorage('contentSectionIsOpen') === true; }
        },
        pageSectionIsOpen: {
            getValue () {
                const storedValue = localStorage.getItem('pageSectionIsOpen');
                if(storedValue === 'true' || storedValue === 'false') { return storedValue === 'true' ? true : false; }
                else { return null; }
            },
            hasValue () { return existsInLocalStorage('pageSectionIsOpen') === true; }
        },
        selectedContentSection: {
            getValue () {
                const storedValue = parseInt(localStorage.getItem('selectedContentSection'));
                return Number.isInteger(storedValue) === true ? storedValue : null;
            },
            hasValue () { return existsInLocalStorage('selectedContentSection') === true; }
        },
        selectedPageSection: {
            getValue () {
                const storedValue = parseInt(localStorage.getItem('selectedPageSection'));
                return Number.isInteger(storedValue) === true ? storedValue : null;
            },
            hasValue () { return existsInLocalStorage('selectedPageSection') === true; }
        }
    }

    updateLocalStorageToMatchState = () => {
        if(this.state.componentHasMounted === false) { return; }
        const fields = Object.keys(this.persistantFields);

        for(let i = 0; i < fields.length; i++) {
            localStorage.setItem(fields[i], String(this.state[fields[i]]));
        }
    }

    componentDidMount () {
        const dashboardContext = this.state.dashboardContext;
        dashboardContext.updateProperty = (propertyName, newValue) => {
            if(Object.keys(this.state.dashboardContext).includes(propertyName) === true && propertyName !== 'updateProperty') {
                const updatedDashboardContext = dashboardContext;
                updatedDashboardContext[propertyName] = newValue;
                this.setState({ dashboardContext: updatedDashboardContext });
            }
        }

        const allLocalStorageValuesAreValid = () => {
            const fields = Object.keys(this.persistantFields);
            for(let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if(this.persistantFields[field].hasValue() === false) { return false; }
            }

            return true;
        }

        const newState = allLocalStorageValuesAreValid() === true && this.localStorageMatchesState() === false
            ? this.createNewStateToMatchLocalStorage(true)
            : { componentHasMounted: true }
        ;

        this.setState({ ...newState, dashboardContext });
    }

    render() {
        if(this.localStorageMatchesState() === false) { this.updateLocalStorageToMatchState(); }
       
        return (
            <ContentDashboardContext.Provider value={this.state.dashboardContext}>
                <ContentOptionsContext.Provider value={this.state.contentContext}>
                    <div className="content-dashboard">
                        <h1>Content Dashboard</h1>
                        <AdminUserDisplay displayName={userDisplay} />
                        <hr />
                        { this.state.componentHasMounted &&
                            <ContentSectionManager
                                changeContentSection={this.changeContentSection}
                                changePageSection={this.changePageSection}
                                closeContentSection={this.closeContentSection}
                                closePageSection={this.closePageSection}
                                contentSectionIsOpen={this.state.contentSectionIsOpen}
                                pageSectionIsOpen={this.state.pageSectionIsOpen}
                                selectedContentSection={this.state.selectedContentSection}
                                selectedPageSection={this.state.selectedPageSection}
                            />
                        }
                    </div>
                </ContentOptionsContext.Provider>
            </ContentDashboardContext.Provider>
        )
    }
}

export default ContentDashboard
