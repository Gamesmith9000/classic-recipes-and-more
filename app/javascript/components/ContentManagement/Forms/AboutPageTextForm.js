import React, {Fragment} from 'react'
import axios from 'axios'
import { bumpArrayElement, isValuelessFalsey, objectsHaveMatchingValues, setAxiosCsrfToken } from '../../../Helpers'
import { UnsavedChangesDisplay } from '../../../ComponentHelpers'

class AboutPageTextForm extends React.Component {
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
            console.log(res);

            this.setState({
                nextUniqueLocalId: res.data.data.attributes.about_page_sections.length, 
                sections: res.data.data.attributes.about_page_sections.map((value, index) => {
                    return {
                        localId: index,
                        textContent: value
                    };
                }),
                priorSectionsState: res.data.data.attributes.about_page_sections.map((value, index) => {
                    return {
                        localId: index,
                        textContent: value
                    };
                })
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

        let updatedSectionsState = this.state.sections.slice();
        const nextId = this.state.nextUniqueLocalId;
        const newSection = {
            localId: nextId,
            textContent: ''
        };
        updatedSectionsState.push(newSection);
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
            <li className="section-edits" key={element.localId}>
                <label>
                    {index}&nbsp;
                    <textarea 
                        className="section-input"
                        onChange={(event) => this.handleSectionInputChange(event, arrayIndex)}
                        value={this.state.sections[arrayIndex].textContent}
                    />

                    {sectionList.length > 1 &&
                        <Fragment>
                            <button 
                                className={index > 0 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({sections: bumpArrayElement(this.state.sections, index, -1)});
                                }}
                            >
                                ▲
                            </button>
                            <button 
                                className={index < sectionList.length - 1 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({sections: bumpArrayElement(this.state.sections, index, 1)});
                                }}
                            >
                                ▼
                            </button>
                            <button className="delete-item" onClick={(event) => this.handleDeleteSectionButtonInput(event, arrayIndex)}>
                                Delete
                            </button>
                        </Fragment>
                    }
                </label>
            </li>
            )
        });
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
                                { this.state.sections &&
                                    this.mapSectionInputs(this.state.sections)
                                }
                                <button onClick={this.handleAddSection}>+</button>
                            </label>
                            <br />
                            <button disabled={!hasUnsavedChanges} type="submit">Update</button>
                            <UnsavedChangesDisplay 
                                hasUnsavedChanges={hasUnsavedChanges} 
                            />
                        </form>
                    }
            </div>
        )
    }
}

export default AboutPageTextForm
