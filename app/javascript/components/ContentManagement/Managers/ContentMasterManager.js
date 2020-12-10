import React, { Fragment } from 'react'
import SectionPicker from '../Pickers/SectionPicker';
import { AdminUserDisplay } from './Subcomponents'
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
            contentSectionOpen: true,
            selectedContentSection: newSectionId
        });
    }
    
    closeContentSection = () => {
        this.setState({ contentSectionOpen: false });
    }

    render() {
        return (
            <div className="content-management">
                <h1>Manage Content</h1>
                <AdminUserDisplay displayName={userDisplay} />
                <SectionPicker 
                    changeContentSection={this.changeContentSection}
                    closeContentSection={this.closeContentSection}      
                    contentSectionOpen={this.state.contentSectionOpen}
                    selectedContentSection={this.state.selectedContentSection}
                />
                <hr />
                { this.state.contentSectionOpen === true &&
                    <Fragment>
                        { ContentSectionsInfo.sections[this.state.selectedContentSection].renderComponent({ photoPickerPhotoVersion: "thumb" }) }
                    </Fragment>
                }
            </div>
        )
    }
}

export default ContentMasterManager
