import axios from 'axios'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { TextSectionWithId } from '../../Utilities/Constructors'
import { UnsavedChangesDisplay } from '../../Utilities/ComponentHelpers'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'

class AboutPageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            nextUniqueLocalId: 0,
            aboutSectionData: null,
            priorAboutSectionData: null
        }
    }

    componentDidMount () {
        axios.get('/api/v1/aux/about_sections.json')
        .then(res => this.initializeComponentStateFromResponse(res))
        .catch(err => console.log(err));
    }

    getSectionIndexFromState = (localId) => {
        for(let i = 0; i < this.state.aboutSectionData.length; i++){
            if(this.state.aboutSectionData[i]?.localId === localId) { return i; }
        }
        return -1;
    }

    handleAddSection = (event) => {
        event.preventDefault();

        const nextId = this.state.nextUniqueLocalId;
        let updatedSectionsState = this.state.aboutSectionData.slice();
        updatedSectionsState.push(new TextSectionWithId(nextId, ''));

        this.setState({
            nextUniqueLocalId: nextId + 1,
            aboutSectionData: updatedSectionsState 
        });
    }

    handleDeleteSectionButtonInput = (event, sectionIndex) => {
        event.preventDefault();

        if(window.confirm("Are you sure you want to delete this section?") === true) {
            let newSectionsState = this.state.aboutSectionData.slice();
            newSectionsState.splice(sectionIndex, 1);
            this.setState({ aboutSectionData: newSectionsState });
        }
    }

	handleFormSubmit = (event) => {
   	event.preventDefault();
   	setAxiosCsrfToken();

		const outgoingSectionsData = this.state.aboutSectionData.map(
			function(element, index) {
				return {
					id: element.id,
					ordinal: index,
					text_content: element.textContent
				}
			}
		);

		axios.patch('/api/v1/aux/about_sections.json', { aux_data: { about_sections: outgoingSectionsData } })
			.then(res => this.setState({ priorAboutSectionData: this.state.aboutSectionData }))
			.catch(err => console.log(err));
	}

    handleSectionInputChange = (event, sectionIndex) => {
        event.preventDefault();

        let updatedSectionsState = this.state.aboutSectionData.slice();
        updatedSectionsState[sectionIndex].textContent = event.target.value;
        this.setState({ aboutSectionData: updatedSectionsState });
    }

    initializeComponentStateFromResponse = (res) => {
        const aboutSectionsData = res.data.data;

        const mapAboutSectionData = function (element, index) {
            const includedPhotos = res.data.included.filter(item => item.type === "photo");
            const includedOrderedPhotos = res.data.included.filter(item => item.type === "ordered_photo");

            const mapOrderedPhotoData = function (orderedPhotoElement) {
                const photo = includedPhotos.find(item => item.id === orderedPhotoElement.relationships.photo.data.id);

                return {
                    id: parseInt(photo.id),
                    file: photo.attributes.file
                    // 'file' is temporary. Only proper url will be stored in future
                }
            }
            
            const newItem = {
                id: parseInt(element.id),
                localId: index,
                orderedPhotos: includedOrderedPhotos.map(mapOrderedPhotoData),
                textContent: element.attributes.text_content ? element.attributes.text_content : ""
            };
            return newItem;
        }

        if(!aboutSectionsData || aboutSectionsData.length <= 0) { return; }

        this.setState ({
            nextUniqueLocalId: aboutSectionsData.length, 
            aboutSectionData: aboutSectionsData.map(mapAboutSectionData),
            priorAboutSectionData: aboutSectionsData.map(mapAboutSectionData),
        });
    }

    mapSectionInputs = (sectionList) => {
        return sectionList.map((element, index) => {
            const arrayIndex = this.getSectionIndexFromState(element.localId);
            if(isValuelessFalsey(arrayIndex) || arrayIndex === -1) { return; }
            return (
                <Draggable draggableId={element.localId.toString()} index={index} key={element.localId}>
                    { (provided) => (
                        <li {...provided.dragHandleProps} {...provided.draggableProps} className="section-edits" ref={provided.innerRef}>
                            <label>
                                <textarea 
                                    className="section-input"
                                    onChange={(event) => this.handleSectionInputChange(event, arrayIndex)}
                                    value={this.state.aboutSectionData[arrayIndex].textContent}
                                />
                                { sectionList.length > 1 &&
                                    <button 
                                        className="delete-item" 
                                        onClick={(event) => this.handleDeleteSectionButtonInput(event, arrayIndex)}
                                    >
                                        Delete
                                    </button>
                                }
                            </label>
                        </li>
                    )}
                </Draggable>
            )
        });
    }

    onSectionDragEnd = (result) => {
        if(!result.destination) { return; }

        let newSectionsState = this.state.aboutSectionData.slice();
        const movedItem = newSectionsState.splice(result.source.index, 1)[0];
        newSectionsState.splice(result.destination.index, 0, movedItem);

        this.setState({ aboutSectionData: newSectionsState });
    }

    render() {
        const hasSectionsState = Boolean(this.state.aboutSectionData);
        const hasUnsavedChanges = (hasSectionsState === true && objectsHaveMatchingValues(this.state.aboutSectionData, this.state.priorAboutSectionData) === false);

        return (
            <div className="about-page-editor">
                <h2>Editing "About" Page</h2>
                    { hasSectionsState === true &&
                        <form className="about-page-form" onSubmit={this.handleFormSubmit}>
                            <label>
                                <h3>Sections</h3>
                                <DragDropContext onDragEnd={this.onSectionDragEnd}>
                                    <Droppable droppableId="sections-editor">
                                        { (provided) => (
                                            <ul {...provided.droppableProps} className="sections-editor" ref={provided.innerRef}>
                                                { this.state.aboutSectionData &&
                                                    this.mapSectionInputs(this.state.aboutSectionData)
                                                }
                                                { provided.placeholder }
                                            </ul>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                <button onClick={this.handleAddSection}>+</button>
                            </label>
                            <br />
                            <button disabled={!hasUnsavedChanges} type="submit">Update</button>
                            <UnsavedChangesDisplay hasUnsavedChanges={hasUnsavedChanges} />
                        </form>
                    }
            </div>
        )
    }
}

export default AboutPageForm
