import React, { Fragment } from 'react'
import PageManager from './Managers/PageManager';
import PhotoManager from './Managers/PhotoManager';
import RecipeManager from './Managers/RecipeManager';
import SectionSelector from './SectionSelector';


class ContentManagementDashboard extends React.Component {
    constructor () {
        super();
        this.state = ({
            contentSectionOpen: true,
            selectedContentSection: 1   // [NOTE] Value modified for ease of creating new sections
        });
    }

    /*  contentSection ID legend: 
        0 - Pages, 1 - Recipes, 2 - Photos */

    changeContentSection = (newSectionIdentifier) => {
        // [NOTE] The max number for content section identifier is hard coded here:
        if (!Number.isInteger(newSectionIdentifier) || newSectionIdentifier < 0 || newSectionIdentifier > 2 || newSectionIdentifier === this.state.selectedContentSection) {
            return;
        }
        this.setState({
            selectedContentSection: newSectionIdentifier
        });
    }
    
    closeContentSection = () => {
        this.setState({
            contentSectionOpen: false
        });
    }

    openContentSection = () => {
        this.setState({
            contentSectionOpen: true
        });
    } 

    renderContentSectionComponent = () => {
        if(this.state.contentSectionOpen === false) {
            return;
        }

        let renderedItem;
        switch(this.state.selectedContentSection){
            case 0:
                renderedItem = <PageManager />
                break;
            case 1:
                renderedItem = <RecipeManager />
                break;
            case 2:
                renderedItem = <PhotoManager />
                break;
        }
        return renderedItem;
    }

    render() {
        return (
            <div className="content-management">
                <h1>Content Management Dashboard</h1>
                <SectionSelector 
                    changeContentSection={this.changeContentSection}
                    closeContentSection={this.closeContentSection}      
                    contentSectionOpen={this.state.contentSectionOpen}
                    openContentSection={this.openContentSection}      
                    selectedContentSection={this.state.selectedContentSection}
                />
                <hr />
                <Fragment>{this.renderContentSectionComponent()}</Fragment>
            </div>
        )
    }
}

export default ContentManagementDashboard
