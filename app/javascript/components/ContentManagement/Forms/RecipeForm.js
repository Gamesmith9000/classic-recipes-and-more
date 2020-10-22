import React, { Fragment } from 'react'
import axios from 'axios'
import { arraysHaveMatchingValues, bumpArrayElement, mapSectionsDataFromAxiosResponse, setAxiosCsrfToken } from '../../../Helpers'
import { unsavedChangesMessage } from '../../../ComponentHelpers'

class RecipeForm extends React.Component {
    // [NOTE] Validation error messages are not yet implemented

    constructor() {
        super();
        this.state = {
            description: '',
            existingRecipe: false,
            featured: false,
            ingredients: [''],
            priorRecipeState: {
                ingredients: [''],
                sections: [{
                    id: null,
                    ordered_photo_ids: null,
                    recipeId: null,
                    text_content: ''
                }],
                title: '',
            },
            sections: [{
                id: null,
                ordered_photo_ids: null,
                recipeId: null,
                text_content: ''
                }
            ],
            title: ''
        }
    }

    handleAddIngredient = (event) => {
        event.preventDefault();
        let updatedIngredientsState = this.state.ingredients.slice();
        updatedIngredientsState.push('');
        this.setState({ingredients: updatedIngredientsState});
    }

    handleAddSection = (event) => {
        event.preventDefault();
        let updatedSectionsState = this.state.sections.slice();
        updatedSectionsState.push({
            id: null,
            ordered_photo_ids: null,
            recipeId: null,
            text_content: ''
        });
        this.setState({sections: updatedSectionsState});
    }

    handleDeleteIngredientButtonInput = (event, index) => {
        event.preventDefault();
        if(window.confirm("Are you sure you want to delete this ingredient?")) {
            let newIngredientsState = this.state.ingredients.slice();
            newIngredientsState.splice(index, 1);
            this.setState({ingredients: newIngredientsState});
        }
    }

    handleDeleteSectionButtonInput = (event, index) => {
        event.preventDefault();
        if(window.confirm("Are you sure you want to delete this section?")) {
            let newSectionsState = this.state.sections.slice();
            newSectionsState.splice(index, 1);
            this.setState({sections: newSectionsState});
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const requestType = this.state.existingRecipe ? 'patch' : 'post';
        const requestUrl = this.state.existingRecipe ? `/api/v1/recipes/${this.props.recipeId}` : '/api/v1/recipes';

        axios({
            method: requestType,
            url: requestUrl,
            data: this.state
            // [NOTE] The data passed in needs to be better mapped. Extra, useless data is being sent within the request
        })
        .then(res => {
            if(this.state.existingRecipe === false) {
                this.props.closeForm(null);
                return;
            }
            this.setState({
                priorRecipeState: {
                    description: this.state.description,
                    featured: this.state.featured,
                    ingredients: this.state.ingredients,
                    sections: this.state.sections,
                    title: this.state.title
                }
                // [NOTE] Updated section data will need to be fetched after this (assuming it has been changed)
            });
        })
        .catch(err => console.log(err));
    }

    handleIngredientInputChange = (event, index) => {
        let updatedIngredientsState = this.state.ingredients.slice();
        updatedIngredientsState[index] = event.target.value;
        this.setState({ingredients: updatedIngredientsState});
    }

    handleSectionMove = (index, direction) => {
        if(direction !== -1 && direction !== 1) {
            return;
        }

        const targetIndex = index - direction;
        const originalTextAtIndex = this.state.sections[index].text_content;
        const originalTextAtTarget = this.state.sections[targetIndex].text_content;

        let newSectionsState = this.state.sections.slice();
        newSectionsState[index].text_content = originalTextAtTarget;
        newSectionsState[targetIndex].text_content = originalTextAtIndex;

        this.setState({
            sections: newSectionsState
        });
    }

    handleSectionTextInputChange = (event, index) => {
        let updatedSectionsState = this.state.sections.slice();
        updatedSectionsState[index].text_content = event.target.value;
        this.setState({sections: updatedSectionsState});
    }

    handleTitleInputChange = (event) => {
        this.setState({title: event.target.value});
    }

    isExistingRecipeWithChanges = () => {
        if(this.state.existingRecipe !== true) {
            return false;
        }
        if(arraysHaveMatchingValues(this.state.ingredients, this.state.priorRecipeState.ingredients) &&
        arraysHaveMatchingValues(this.state.sections, this.state.priorRecipeState.sections) &&
        this.state.title === this.state.priorRecipeState.title) {
            return false;
        }
        return true;
    }

    mapIngredientInputs = (ingredientList) => {
        return ingredientList.map((item, index) => {
            return (
            <li className="ingredients-edits" key={index}>
                <label>
                    {index}
                    <input 
                        className="ingredient-input"
                        onChange={(event) => this.handleIngredientInputChange(event, index)}
                        type="text"
                        value={this.state.ingredients[index]}
                    />
                    {ingredientList.length > 1 &&
                        <Fragment>
                            <button 
                                className={index > 0 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({ingredients: bumpArrayElement(this.state.ingredients, index, -1)});
                                }}
                            >
                                ▲
                            </button>
                            <button 
                                className={index < ingredientList.length - 1 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({ingredients: bumpArrayElement(this.state.ingredients, index, 1)});
                                }}
                            >
                                ▼
                            </button>
                            <button className="delete-item" onClick={(event) => this.handleDeleteIngredientButtonInput(event, index)}>
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

    mapSectionInputs = (sectionsList) => {
        return sectionsList.map((item, index) => {
            return (
            <li className="section-edits" key={index}>
                <label>
                    {index}
                    <textarea 
                        className="section-text-input" 
                        onChange={(event) => this.handleSectionTextInputChange(event, index)}
                        value={this.state.sections[index].text_content}
                    />

                    {sectionsList.length > 1 && 
                        <Fragment>
                            <button 
                                className={index > 0 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.handleSectionMove(index, 1);
                                }}
                            >
                                ▲
                            </button>
                            <button 
                                className={index < sectionsList.length - 1 ? "move-item" : "move-item hidden"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.handleSectionMove(index, -1);
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

    componentDidMount () {
        if(this.props.recipeId) {
            axios.get(`/api/v1/recipes/${this.props.recipeId}`, { 
                params: {
                    id: this.props.recipeId
                }
            })
            .then(res => {
                console.log(res);

                const sectionsData = mapSectionsDataFromAxiosResponse(res);
                const attributes = res.data.data.attributes;
                
                this.setState({
                    description: attributes.description,
                    existingRecipe: true,
                    featured: attributes.featured,
                    ingredients: attributes.ingredients,
                    priorRecipeState: {
                        description: attributes.description,
                        featured: attributes.featured,
                        ingredients: attributes.ingredients,
                        sections: sectionsData,
                        title: attributes.title,                        
                    },
                    sections: sectionsData,
                    title: attributes.title
                });
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <form className="recipe-form" onSubmit={this.handleFormSubmit}>
                <h2>{this.state.existingRecipe ? 'Edit' : 'New'} Recipe</h2>
                <label>
                    Title
                    <input 
                        className="title-input"
                        onChange={this.handleTitleInputChange}
                        type="text"
                        value={this.state.title}
                    />
                </label>
                <br />
                <br />
                <label>
                    Ingredients
                    <br />
                    {this.state.ingredients &&
                        this.mapIngredientInputs(this.state.ingredients)
                    }
                    <button onClick={this.handleAddIngredient}>+</button>
                </label>
                <br />
                <br />
                <label>
                    Sections
                    <br />
                    {this.state.sections &&
                        this.mapSectionInputs(this.state.sections)
                    }
                    {<button onClick={this.handleAddSection}>+</button>}
                </label>
                <br/>
                <br/>
                <button onClick={this.handleFormSubmit}>
                    {this.state.existingRecipe ? 'Update' : 'Create'}
                </button>
                <button onClick={this.props.closeForm}>Close</button>
                { unsavedChangesMessage(this.isExistingRecipeWithChanges() === true) }
            </form>
        )
    }
}

export default RecipeForm
