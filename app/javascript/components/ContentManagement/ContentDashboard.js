import React, { Fragment } from 'react'
import AdminUserDisplay from './Subcomponents/AdminUserDisplay'
import { existsInLocalStorage, objectsHaveMatchingValues } from '../Utilities/Helpers';
import ContentSectionManager from './Managers/ContentSectionManager';
import ContentContext from './ContentOptionsContext'

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

    updateStateToMatchLocalStorage = (changedMountedStateToTrue = false) => {
        const fields = ['contentSectionOpen', 'selectedContentSection'];
        const newState = {};

        for(let i = 0; i < fields.length; i++) {
            newState[fields[i]] = this.localStorageValues[fields[i]].getValue();
        }

        if(changedMountedStateToTrue === true) { newState.componentHasMounted = true; }
        this.setState({ ...newState });
    }

    componentDidMount () {
        if(this.localStorageValues.allValuesAreValid() === true && this.localStorageMatchesState() === false) { 
            this.updateStateToMatchLocalStorage(true); 
        }
        else { this.setState({ componentHasMounted: true }) }
    }

    render() {
        if(this.localStorageMatchesState() === false) { this.updateLocalStorageToMatchState(); }
        
        return (
            <ContentContext.Provider value={this.state.contentContext}>
                <div className="content-dashboard">
                    <h1>Content Dashboard</h1>
                    <AdminUserDisplay displayName={userDisplay} />
                    { this.state.componentHasMounted &&
                        <ContentSectionManager
                            changeContentSection={this.changeContentSection}
                            closeContentSection={this.closeContentSection}      
                            contentSectionOpen={this.state.contentSectionOpen}
                            selectedContentSection={this.state.selectedContentSection}
                        />
                    }
                </div>
            </ContentContext.Provider>
        )
    }
}

export default ContentDashboard
