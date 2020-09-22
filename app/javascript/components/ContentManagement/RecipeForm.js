import React, { Fragment } from 'react'
import axios from 'axios'
import { array } from 'prop-types';
import { arraysHaveMatchingValues, bumpArrayElement } from '../../Helpers'

class RecipeForm extends React.Component {
    constructor() {
        super();
        this.state = {
            existingRecipe: false,
            ingredients: [''],
            paragraphs: [''],
            priorPrimaryState: {
                ingredients: [''],
                paragraphs: [''],
                title: '',
            },
            title: ''
        }
    }

    handleAddIngredient = (event) => {
        event.preventDefault();
        let updatedIngredientsState = this.state.ingredients;
        updatedIngredientsState.push('');
        this.setState({ingredients: updatedIngredientsState});
    }

    handleAddParagraph = (event) => {
        event.preventDefault();
        let updatedParagraphsState = this.state.paragraphs;
        updatedParagraphsState.push('');
        this.setState({paragraphs: updatedParagraphsState});
    }

    handleDeleteIngredientButtonInput = (event, index) => {
        event.preventDefault();
        if(window.confirm("Are you sure you want to delete this ingredient?")) {
            let newIngredientsState = this.state.ingredients.slice();
            newIngredientsState.splice(index, 1);
            this.setState({ingredients: newIngredientsState});
        }
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
        const csrfToken = document.querySelector('meta[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        const requestType = this.state.existingRecipe ? 'patch' : 'post';
        const requestUrl = this.state.existingRecipe ? `/api/v1/recipes/${this.props.recipeId}` : '/api/v1/recipes';

        axios({
            method: requestType,
            url: requestUrl,
            data: this.state
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    handleIngredientInputChange = (event, index) => {
        let updatedIngredientsState = this.state.ingredients;
        updatedIngredientsState[index] = event.target.value;
        this.setState({ingredients: updatedIngredientsState});
    }

    handleParagraphInputChange = (event, index) => {
        let updatedParagraphsState = this.state.paragraphs;
        updatedParagraphsState[index] = event.target.value;
        this.setState({paragraphs: updatedParagraphsState});
    }

    handleTitleInputChange = (event) => {
        this.setState({title: event.target.value});
    }

    isExistingRecipeWithChanges = () => {
        if(this.state.existingRecipe !== true) {
            return false;
        }
        if(arraysHaveMatchingValues(this.state.ingredients, this.state.priorPrimaryState.ingredients) &&
        arraysHaveMatchingValues(this.state.paragraphs, this.state.priorPrimaryState.paragraphs) &&
        this.state.title === this.state.priorPrimaryState.title) {
            return false;
        }
        else {
            return true;
        }
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

    componentDidMount () {
        if(this.props.recipeId !== null && this.props.recipeId !== undefined) {

            axios.get(`/api/v1/recipes/${this.props.recipeId}`, { 
                params: {
                    id: this.props.recipeId
                }
            })
            .then(res => {
                this.setState({
                    existingRecipe: true,
                    ingredients: res.data.data.attributes.ingredients,
                    paragraphs: res.data.data.attributes.paragraphs,
                    priorPrimaryState: {
                        ingredients: res.data.data.attributes.ingredients,
                        paragraphs: res.data.data.attributes.paragraphs,
                        title: res.data.data.attributes.title,                        
                    },
                    title: res.data.data.attributes.title
                });
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        const { recipeId } = this.props;

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
                    Paragraphs
                    <br />
                    {this.state.paragraphs &&
                        this.mapParagraphInputs(this.state.paragraphs)
                    }
                    <button onClick={this.handleAddParagraph}>+</button>
                </label>
                <br/>
                <button type="submit">
                    {this.state.existingRecipe ? 'Update' : 'Create'}
                </button>
                {this.isExistingRecipeWithChanges() === true ?
                    <p>
                        YOU HAVE UNSAVED CHANGES!
                    </p>
                    :
                    <br/>
                }

            </form>
        )
    }
}

export default RecipeForm
