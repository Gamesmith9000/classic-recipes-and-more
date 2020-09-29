import React, {Fragment} from 'react'
import axios from 'axios'
import { arraysHaveMatchingValues, bumpArrayElement, setAxiosCsrfToken } from '../../Helpers'
import { unsavedChangesMessage } from '../../ComponentHelpers'

class AboutPageTextForm extends React.Component {
    constructor() {
        super();
        this.state = {
            paragraphs: null,
            priorParagraphsState: null
        }
    }

    componentDidMount () {
        setAxiosCsrfToken();

        axios.get('/api/v1/aux/main.json')
        .then(res => {
            console.log(res);
            this.setState({
                paragraphs: res.data.data.attributes.about_page_paragraphs,
                priorParagraphsState: res.data.data.attributes.about_page_paragraphs
            });
        })
        .catch(err => console.log(err));
    }

    // [NOTE] Paragraph edit logic was ported from RecipeForm component. Attempt to find a more DRY implementation

    handleAddParagraph = (event) => {
        event.preventDefault();
        let updatedParagraphsState = this.state.paragraphs.slice();
        updatedParagraphsState.push('');
        this.setState({paragraphs: updatedParagraphsState});
    }

    handleDeleteParagraphButtonInput = (event, index) => {
        event.preventDefault();
        if(window.confirm("Are you sure you want to delete this paragraph?")) {
            let newParagraphsState = this.state.paragraphs.slice();
            newParagraphsState.splice(index, 1);
            this.setState({paragraphs: newParagraphsState});
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        axios.patch('/api/v1/aux/main.json', { 
            aux_data: {
                about_page_paragraphs: this.state.paragraphs
            }
        })
        .then(res => {
            console.log(res);
            this.setState({
                priorParagraphsState: this.state.paragraphs
            });
        })
        .catch(err => console.log(err));
    }

    handleParagraphInputChange = (event, index) => {
        let updatedParagraphsState = this.state.paragraphs;
        updatedParagraphsState[index] = event.target.value;
        this.setState({paragraphs: updatedParagraphsState});
    }

    mapParagraphInputs = (paragraphList) => {
        return paragraphList.map((item, index) => {
            return (
            <li className="paragraph-edits" key={index}>
                <label>
                    {index}
                    <textarea 
                        className="paragraph-input"
                        onChange={(event) => this.handleParagraphInputChange(event, index)}
                        value={this.state.paragraphs[index]}
                    />

                    {paragraphList.length > 1 &&
                        <Fragment>
                            <button 
                                className={index > 0 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({paragraphs: bumpArrayElement(this.state.paragraphs, index, -1)});
                                }}
                            >
                                ▲
                            </button>
                            <button 
                                className={index < paragraphList.length - 1 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({paragraphs: bumpArrayElement(this.state.paragraphs, index, 1)});
                                }}
                            >
                                ▼
                            </button>
                            <button className="delete-item" onClick={(event) => this.handleDeleteParagraphButtonInput(event, index)}>
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
                {this.state.paragraphs &&
                    <form className="about-text-form" onSubmit={this.handleFormSubmit}>
                    <label>
                        Paragraphs
                        <br />
                        {this.state.paragraphs &&
                            this.mapParagraphInputs(this.state.paragraphs)
                        }
                        <button onClick={this.handleAddParagraph}>+</button>
                    </label>
                    <br />
                    <button type="submit">Update</button>
                    {unsavedChangesMessage(!arraysHaveMatchingValues(this.state.paragraphs, this.state.priorParagraphsState))}
                    </form>
                }
            </Fragment>
        )
    }
}

export default AboutPageTextForm
