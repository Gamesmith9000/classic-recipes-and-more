import React, {Fragment} from 'react'
import axios from 'axios'
import { arraysHaveMatchingValues, bumpArrayElement, setAxiosCsrfToken } from '../../Helpers'
import { unsavedChangesMessage } from '../../ComponentHelpers'

class AboutPageTextForm extends React.Component {
    constructor() {
        super();
        this.state = {
            sections: null,
            priorSectionsState: null
        }
    }

    componentDidMount () {
        setAxiosCsrfToken();

        axios.get('/api/v1/aux/main.json')
        .then(res => {
            console.log(res);
            this.setState({
                sections: res.data.data.attributes.about_page_sections,
                priorSectionsState: res.data.data.attributes.about_page_sections
            });
        })
        .catch(err => console.log(err));
    }

    // [NOTE] Paragraph edit logic was ported from RecipeForm component. Attempt to find a more DRY implementation
    // [NOTE] Later, 'Paragraph' instances and logic were converted to 'Section' instead

    handleAddSection = (event) => {
        event.preventDefault();
        let updatedsectionsState = this.state.sections.slice();
        updatedsectionsState.push('');
        this.setState({sections: updatedsectionsState});
    }

    handleDeleteSectionButtonInput = (event, index) => {
        event.preventDefault();
        if(window.confirm("Are you sure you want to delete this section?")) {
            let newsectionsState = this.state.sections.slice();
            newsectionsState.splice(index, 1);
            this.setState({sections: newsectionsState});
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        axios.patch('/api/v1/aux/main.json', { 
            aux_data: {
                about_page_sections: this.state.sections
            }
        })
        .then(res => {
            console.log(res);
            this.setState({
                priorSectionsState: this.state.sections
            });
        })
        .catch(err => console.log(err));
    }

    handleSectionInputChange = (event, index) => {
        let updatedsectionsState = this.state.sections.slice();
        updatedsectionsState[index] = event.target.value;
        this.setState({sections: updatedsectionsState});
    }

    mapSectionInputs = (sectionList) => {
        return sectionList.map((item, index) => {
            return (
            <li className="section-edits" key={index}>
                <label>
                    {index}
                    <textarea 
                        className="section-input"
                        onChange={(event) => this.handleSectionInputChange(event, index)}
                        value={this.state.sections[index]}
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
                            <button className="delete-item" onClick={(event) => this.handleDeleteSectionButtonInput(event, index)}>
                                Delete
                            </button>
                        </Fragment>
                    }
                </label>
            </li>
            )
        });
        // [NOTE] Consider changing li key to something other than index.
    }

    render() {
        return (
            <Fragment>
                <h2>Edit "About" Section</h2>
                {this.state.sections &&
                    <form className="about-text-form" onSubmit={this.handleFormSubmit}>
                    <label>
                        sections
                        <br />
                        {this.state.sections &&
                            this.mapSectionInputs(this.state.sections)
                        }
                        <button onClick={this.handleAddSection}>+</button>
                    </label>
                    <br />
                    <button type="submit">Update</button>
                    {unsavedChangesMessage(!arraysHaveMatchingValues(this.state.sections, this.state.priorSectionsState))}
                    </form>
                }
            </Fragment>
        )
    }
}

export default AboutPageTextForm
