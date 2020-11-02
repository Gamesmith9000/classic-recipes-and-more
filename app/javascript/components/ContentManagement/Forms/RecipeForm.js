import React, { Fragment } from 'react'
import axios from 'axios'
import { arraysHaveMatchingValues, BackendConstants, bumpArrayElement, mapSectionsDataFromAxiosResponse, setAxiosCsrfToken } from '../../../Helpers'
import { renderValidationError, unsavedChangesMessage } from '../../../ComponentHelpers'

class RecipeForm extends React.Component {
    constructor() {
        super();
        this.state = {
            description: '',
            existingRecipe: false,
            featured: BackendConstants.models.recipe.defaults.featured,
            ingredients: [''],
            priorRecipeState: {
                description: '',
                featured: BackendConstants.models.recipe.defaults.featured,
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

    handleDescriptionInputChange = (event) => {
        this.setState({description: event.target.value});
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

    handleFeaturedInputChange = (event) => {
        this.setState({featured: event.target.checked});
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();
        const { description, featured, ingredients, sections, title } = this.state;

        const requestType = this.state.existingRecipe === true ? 'patch' : 'post';
        const requestUrl = this.state.existingRecipe === true ? `/api/v1/recipes/${this.props.recipeId}` : '/api/v1/recipes';

        axios({ method: requestType, url: requestUrl, data: { description, featured, ingredients, sections, title } })
        .then(res => {
            if(this.state.existingRecipe === false) { this.props.handleClose(); }
            else { this.handleFormSubmitResponse(res); }
        })
        .catch(err => { this.handleFormSubmitResponse(err); });
    }

    handleFormSubmitResponse = (res) =>{
        if(res?.status === 200 && res.data && res.data.data?.type === "recipe") {
            this.setState({
                errors: null,
                priorRecipeState: {
                    description: this.state.description,
                    featured: this.state.featured,
                    ingredients: this.state.ingredients,
                    sections: this.state.sections,
                    title: this.state.title
                }
            });
        }
        else if (res?.response?.status === 422) { this.setState({ errors: res.response.data.error }); }
    }

    handleIngredientInputChange = (event, index) => {
        let updatedIngredientsState = this.state.ingredients.slice();
        updatedIngredientsState[index] = event.target.value;
        this.setState({ingredients: updatedIngredientsState});
    }

    handleSectionMove = (index, direction) => {
        if(direction !== -1 && direction !== 1) { return; }

        const targetIndex = index - direction;
        const originalTextAtIndex = this.state.sections[index].text_content;
        const originalTextAtTarget = this.state.sections[targetIndex].text_content;

        let newSectionsState = this.state.sections.slice();
        newSectionsState[index].text_content = originalTextAtTarget;
        newSectionsState[targetIndex].text_content = originalTextAtIndex;

        this.setState({  sections: newSectionsState });
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
        if(this.state.existingRecipe !== true) { return false; }

        if(arraysHaveMatchingValues(this.state.ingredients, this.state.priorRecipeState.ingredients) &&
        arraysHaveMatchingValues(this.state.sections, this.state.priorRecipeState.sections) &&
        this.state.description === this.state.priorRecipeState.description &&
        this.state.featured === this.state.priorRecipeState.featured &&
        this.state.title === this.state.priorRecipeState.title) { return false; }
        else { return true; }
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
                <h2>{this.state.existingRecipe === true ? 'Edit' : 'New'} Recipe</h2>
                {this.state.existingRecipe === true && this.props.recipeId &&
                    <p>ID: {this.props.recipeId}</p>
                }
                <label>
                    Title
                    <input 
                        className="title-input"
                        maxLength={BackendConstants.models.recipe.validations.title.maximum} 
                        onChange={this.handleTitleInputChange}
                        type="text"
                        value={this.state.title}
                    />
                    { renderValidationError('title', this.state.errors) }
                </label>
                <label>
                    Description
                    <textarea 
                        className="description-input"
                        maxLength={BackendConstants.models.recipe.validations.description.maximum} 
                        onChange={this.handleDescriptionInputChange}
                        type="textarea"
                        value={this.state.description}
                    />
                    { renderValidationError('description', this.state.errors) }
                </label>
                <br />
                <label>
                    Featured
                    <input 
                        checked={this.state.featured}
                        className="featured-input"
                        onChange={this.handleFeaturedInputChange}
                        type="checkbox"
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
                    {this.state.existingRecipe === true ? 'Update' : 'Create'}
                </button>
                <button onClick={this.props.handleClose}>Close</button>
                { unsavedChangesMessage(this.isExistingRecipeWithChanges() === true) }
            </form>
        )
    }
}

export default RecipeForm
