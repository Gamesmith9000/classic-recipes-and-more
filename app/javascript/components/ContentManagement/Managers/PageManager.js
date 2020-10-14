import React, { Fragment } from 'react'
import AboutPageTextForm from '../Forms/AboutPageTextForm'

class PageManager extends React.Component {
    constructor () {
        super();
        this.state = {
            selectedPage: 0
        }
    }

    changeSelectedPage = (newSelectedPageIdentifier) => {
        // [NOTE] As is the case in SectionSelector component, the max identifier number is hard coded here:
        if (!Number.isInteger(newSelectedPageIdentifier) || newSelectedPageIdentifier < 0 || newSelectedPageIdentifier > 1 || newSelectedPageIdentifier === this.state.selectedPage) {
            return;
        }
        this.setState({
            selectedPage: newSelectedPageIdentifier
        });
    }

    pageButton = (pageIdentifierNumber, buttonText) => {
        return(
            <button onClick={() => this.changeSelectedPage(pageIdentifierNumber)}>
                {buttonText}
            </button>
        );
    }

    renderPageComponent = () => {
        let renderedItem;
        switch(this.state.selectedPage){
            case 0:
                renderedItem = <AboutPageTextForm />;
                break;
            case 1:
                renderedItem = <p>PHOTO GALLERY EDITING NOT YET IMPLEMENTED</p>
                break;

        }
        return renderedItem;
    }

    render() {
        return (
            <div className="page-manager">
                <h1>Page Manager</h1>
                <div className="page-selector">
                    <div>Manage Page:</div>
                    <Fragment>
                        {this.pageButton(0, "About")}
                        {this.pageButton(1, "Photo Gallery")}
                    </Fragment>
                </div>
                <hr />
                <Fragment>{this.renderPageComponent()}</Fragment>
            </div>
        )
    }
}

export default PageManager
