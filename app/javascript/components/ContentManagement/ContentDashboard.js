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
            contentSectionOpen: false,
            selectedContentSection: 0
        });
    }

    changeContentSection = (newSectionIdentifier) => {
        this.setState({
            contentSectionOpen: true,
            selectedContentSection: newSectionIdentifier
        });
    }
    
    closeContentSection = () => {
        this.setState({ contentSectionOpen: false });
    }

    createNewStateToMatchLocalStorage = (changedMountedStateToTrue = false) => {
        const fields = ['contentSectionOpen', 'selectedContentSection'];
        const newState = {};

        for(let i = 0; i < fields.length; i++) {
            newState[fields[i]] = this.localStorageValues[fields[i]].getValue();
        }

        if(changedMountedStateToTrue === true) { newState.componentHasMounted = true; }
        return { ...newState };
    }

    localStorageValues = {
        allValuesAreValid () {
            if(this.contentSectionOpen.hasValue() === false) { return false; }
            if(this.selectedContentSection.hasValue() === false) { return false; }
            return true;
        },
        contentSectionOpen: {
            getValue () {
                const storedValue = localStorage.getItem('contentSectionOpen');
                if(storedValue === 'true' || storedValue === 'false') { return storedValue === 'true' ? true : false; }
                else { return null; }
            },
            hasValue () { return existsInLocalStorage('contentSectionOpen') === true; }
        },
        selectedContentSection: {
            getValue () {
                const storedValue = parseInt(localStorage.getItem('selectedContentSection'));
                return Number.isInteger(storedValue) === true ? storedValue : null;
            },
            hasValue () { return existsInLocalStorage('selectedContentSection') === true; }
        }
    }
    
    localStorageMatchesState = () => {
        const storageValues = {};
        storageValues.contentSectionOpen = this.localStorageValues.contentSectionOpen.getValue();
        storageValues.selectedContentSection = this.localStorageValues.selectedContentSection.getValue();

        const stateValues = {};
        stateValues.contentSectionOpen = this.state.contentSectionOpen;
        stateValues.selectedContentSection = this.state.selectedContentSection;

        return objectsHaveMatchingValues(stateValues, storageValues) === true;
    }

    updateLocalStorageToMatchState = () => {
        if(this.state.componentHasMounted === false) { return; }
        const fields = ['contentSectionOpen', 'selectedContentSection'];

        for(let i = 0; i < fields.length; i++) {
            localStorage.setItem(fields[i], String(this.state[fields[i]]));
        }
    }

    componentDidMount () {
        const dashboardContext = this.state.dashboardContext ;
        dashboardContext.updateProperty = (propertyName, newValue) => {
            if(Object.keys(this.state.dashboardContext).includes(propertyName) === true && propertyName !== 'updateProperty') {
                this.setState({ dashboardContext: {[propertyName]: newValue }});
            }
        }

        const newState = this.localStorageValues.allValuesAreValid() === true && this.localStorageMatchesState() === false
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
                                closeContentSection={this.closeContentSection}      
                                contentSectionOpen={this.state.contentSectionOpen}
                                selectedContentSection={this.state.selectedContentSection}
                            />
                        }
                    </div>
                </ContentOptionsContext.Provider>
            </ContentDashboardContext.Provider>
        )
    }
}

export default ContentDashboard
