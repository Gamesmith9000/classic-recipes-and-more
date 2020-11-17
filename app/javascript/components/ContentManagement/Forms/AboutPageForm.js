import axios from 'axios'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { AboutSectionData } from '../../Utilities/Constructors'
import { UnsavedChangesDisplay } from '../../Utilities/ComponentHelpers'
import { isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../Utilities/Helpers'

class AboutPageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            nextUniqueLocalId: 0,
            priorSectionsState: null,
            sections: null            
        }
    }

    componentDidMount () {
        axios.get('/api/v1/aux/main.json')
        .then(res => {
            const aboutPageSections = res.data.data.attributes.about_page_sections;

            this.setState({
                nextUniqueLocalId: aboutPageSections.length, 
                sections: aboutPageSections.map((value, index) => { return new AboutSectionData (index, value); }),
                priorSectionsState: aboutPageSections.map((value, index) => { return new AboutSectionData (index, value); })
            });
        })
        .catch(err => console.log(err));
    }

    getSectionIndexFromState = (localId) => {
        for(let i = 0; i < this.state.sections.length; i++){
            if(this.state.sections[i]?.localId === localId) { return i; }
        }
        return -1;
    }

    handleAddSection = (event) => {
        event.preventDefault();

        const nextId = this.state.nextUniqueLocalId;
        let updatedSectionsState = this.state.sections.slice();
        updatedSectionsState.push(new AboutSectionData(nextId, ''));

        this.setState({
            nextUniqueLocalId: nextId + 1,
            sections: updatedSectionsState 
        });
    }

    handleDeleteSectionButtonInput = (event, sectionIndex) => {
        event.preventDefault();

        if(window.confirm("Are you sure you want to delete this section?") === true) {
            let newSectionsState = this.state.sections.slice();
            newSectionsState.splice(sectionIndex, 1);
            this.setState({ sections: newSectionsState });
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const outgoingSectionsData = this.state.sections.map((element) => { return element.textContent; });

        axios.patch('/api/v1/aux/main.json', { aux_data: { about_page_sections: outgoingSectionsData } })
        .then(res => this.setState({ priorSectionsState: this.state.sections }))
        .catch(err => console.log(err));
    }

    handleSectionInputChange = (event, sectionIndex) => {
        event.preventDefault();

        let updatedSectionsState = this.state.sections.slice();
        updatedSectionsState[sectionIndex].textContent = event.target.value;
        this.setState({ sections: updatedSectionsState });
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
                                    value={this.state.sections[arrayIndex].textContent}
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

        let newSectionsState = this.state.sections.slice();
        const movedItem = newSectionsState.splice(result.source.index, 1)[0];
        newSectionsState.splice(result.destination.index, 0, movedItem);

        this.setState({ sections: newSectionsState });
    }

    render() {
        const hasSectionsState = Boolean(this.state.sections);
        const hasUnsavedChanges = (hasSectionsState === true && !objectsHaveMatchingValues(this.state.sections, this.state.priorSectionsState));

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
                                                { this.state.sections &&
                                                    this.mapSectionInputs(this.state.sections)
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
