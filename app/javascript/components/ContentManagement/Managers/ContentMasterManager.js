import React, { Fragment } from 'react'
import SectionPicker from '../Pickers/SectionPicker';
import { ContentSectionsInfo } from '../../Utilities/ComponentHelpers';

class ContentMasterManager extends React.Component {
    constructor () {
        super();
        this.state = ({
            contentSectionOpen: true,
            selectedContentSection: 0
        });
    }

    changeContentSection = (newSectionIdentifier) => {
        const newSectionId = parseInt(newSectionIdentifier);
        if(!ContentSectionsInfo.isValidSectionId(newSectionId)) { return; } 

        this.setState({
            contentSectionOpen: newSectionId !== this.state.selectedContentSection ? true : !this.state.contentSectionOpen,
            selectedContentSection: newSectionId
        });
    }
    
    closeContentSection = () => {
        this.setState({ contentSectionOpen: false });
    }

    openContentSection = () => {
        this.setState({ contentSectionOpen: true });
    } 

    render() {
        return (
            <div className="content-management">
                <h1>Manage Content</h1>
                <SectionPicker 
                    changeContentSection={this.changeContentSection}
                    closeContentSection={this.closeContentSection}      
                    contentSectionOpen={this.state.contentSectionOpen}
                    openContentSection={this.openContentSection}      
                    selectedContentSection={this.state.selectedContentSection}
                />
                <hr />
                { this.state.contentSectionOpen === true &&
                    <Fragment>{ContentSectionsInfo.sections[this.state.selectedContentSection].component}</Fragment>
                }
            </div>
        )
    }
}

export default ContentMasterManager
