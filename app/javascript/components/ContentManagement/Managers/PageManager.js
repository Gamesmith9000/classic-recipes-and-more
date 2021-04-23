import React from 'react'
import AboutPageForm from '../Forms/AboutPageForm'
import PhotoGalleryPageForm from '../Forms/PhotoGalleryPageForm'
import PagePicker from '../Pickers/PagePicker';


function PageManager (props) { 
    const { pageSectionIsOpen, selectedPageSection } = props;
    const isValidSectionId = (newSectionIdentifier) => PageSectionsInfo.isValidSectionId(newSectionIdentifier);

    return (
        <div className="page-manager">
            <h1>Page Manager</h1>
            <PagePicker {...props} allPageNames={PageSectionsInfo.allSectionNames()} isValidSectionId={isValidSectionId} />
            <hr />
            { pageSectionIsOpen === true &&
                PageSectionsInfo.pages[selectedPageSection].renderComponent()
            }
        </div>
    )
}

export default PageManager

const PageSectionsInfo = {
    allSectionNames: function () {
        const mappedNames = PageSectionsInfo.pages.map(function(item) { return item.name } );
        return mappedNames;
    },
    isValidSectionId: function (newSectionIdentifier) {
        if(Number.isInteger(newSectionIdentifier) === false || newSectionIdentifier < 0 || newSectionIdentifier > this.pages.length -1) {
            return false
        }
        else { return true; }
    },
    // [NOTE][OPTIMIZE] Verify performance of below items. Might need optimization
    // [NOTE][HARD CODED] imageDisplaySize is hard-coded here. When not included as a prop, PhotoGalleryPageForm ceases to function properly
    pages: [
        { name: 'Pages',            renderComponent: function (props) { return <AboutPageForm           {...props} /> } },
        { name: 'Photo Gallery',    renderComponent: function (props) { return <PhotoGalleryPageForm    {...props}  imageDisplaySize="small" /> } }
    ]
}
