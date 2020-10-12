import React, { Fragment } from 'react'
import PageManager from './PageManager';
import PhotoManager from './PhotoManager';
import RecipeManager from './RecipeManager';
import SectionSelector from './SectionSelector';


class ContentManagerHome extends React.Component {
    constructor () {
        super();
        this.state = ({
            contentSectionOpen: false,
            selectedContentSection: 0
        });
    }

    /*  contentSection ID legend: 
        0 - Pages, 1 - Recipes, 2 - Photos */

    changeContentSection = (newSectionIdentifier) => {
        // [NOTE] The max number for content section identifier is hard coded here:
        if (!Number.isInteger(newSectionIdentifier) || newSectionIdentifier < 0 || newSectionIdentifier > 2) {
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

    closeThenChangeContentSection = (newSectionIdentifier) => {
        this.closeContentSection();
        this.changeContentSection(newSectionIdentifier);
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
        // NOTE: Flash messages will need to be rendered here
        //      classes: flash-alert, flash-notice
        //          (to match Devise, wrap them in <p>)
        //      var: flashMessages { alert, notice}
 
        return (
            <div className="content-manager">
                <h1>Content Management Dashboard</h1>
                <SectionSelector 
                    changeContentSection={this.closeContentSection}
                    closeContentSection={this.closeContentSection}      
                    contentSectionOpen={this.state.contentSectionOpen}
                    selectedContentSection={this.state.selectedContentSection}
                />
                <Fragment>
                    {this.renderContentSectionComponent()}
                </Fragment>
            </div>
        )
    }
}

export default ContentManagerHome
