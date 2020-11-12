import React, { Fragment } from 'react'
import axios from 'axios'
import { arraysHaveMatchingValues, BackendConstants, bumpArrayElement, setAxiosCsrfToken } from '../../../Helpers'
import { mapSectionsData } from '../../../ResponseDataHelpers'
import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../../ComponentHelpers'
import PhotoPicker from '../Pickers/PhotoPicker'

class RecipeForm extends React.Component {
    constructor() {
        super();
        this.state = {
            description: '',
            existingRecipe: false,
            featured: BackendConstants.models.recipe.defaults.featured,
            ingredients: [''],
            photoPicker: {
                isOpen: false,
                selectedPhotoId: null,
                selectedPhotoUrl: null
            },
            previewPhotoId: null,
            previewPhotoUrl: null,
            priorRecipeState: {
                description: '',
                featured: BackendConstants.models.recipe.defaults.featured,
                ingredients: [''],
                previewPhotoId: null,
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

    attemptPreviewImageUrlFetch = () => {
        axios.get(`/api/v1/photos/${this.state.previewPhotoId}`)
        .then(res => {
            //[NOTE][HARD-CODED] Image preview size is hard coded and the same across recipes
            const url = res.data?.data?.attributes?.file?.small?.url;
            this.setState({ previewPhotoUrl: url });
        })
        .catch(err => console.log(err));

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

    handleClearPreviewPhoto = (event) => {
        event.preventDefault();
        this.setState({ 
            previewPhotoId: null,
            previewPhotoUrl: null
        });
        
    }

    handleChangeSelectedPhotoId = (newPhotoId) => {
        let photoPickerState = this.state.photoPicker;
        photoPickerState.selectedPhotoId = newPhotoId ? newPhotoId: null;
        this.setState({ photoPicker: photoPickerState });
    }

    handleChangeSelectedPhotoUrl = (newPhotoUrl) => {
        let photoPickerState = this.state.photoPicker;
        photoPickerState.selectedPhotoUrl = newPhotoUrl ? newPhotoUrl: null;
        this.setState({ photoPicker: photoPickerState });
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
        const preview_photo_id = this.state.previewPhotoId;

        const requestType = this.state.existingRecipe === true ? 'patch' : 'post';
        const requestUrl = this.state.existingRecipe === true ? `/api/v1/recipes/${this.props.recipeId}` : '/api/v1/recipes';

        axios({ method: requestType, url: requestUrl, data: { description, featured, ingredients, preview_photo_id, sections, title } })
        .then(res => {
            if(this.state.existingRecipe === false) { this.props.handleClose(); }
            else { this.handleFormSubmitResponse(res); }
        })
        .catch(err => { this.handleFormSubmitResponse(err); });
    }

    handleFormSubmitResponse = (res) =>{
        if(res?.status === 200 && res.data?.data?.type === "recipe") {
            this.setState({
                errors: null,
                priorRecipeState: {
                    description: this.state.description,
                    featured: this.state.featured,
                    ingredients: this.state.ingredients,
                    previewPhotoId: this.state.previewPhotoId,
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

    handlePreviewPhotoIdChange = (event) => {
        event.preventDefault();

        const newId = this.state.photoPicker.selectedPhotoId;
        const newUrl = this.state.photoPicker.selectedPhotoUrl;
        
        let photoPickerState = this.state.photoPicker;
        photoPickerState.isOpen = false;
        photoPickerState.selectedPhotoId = null;
        photoPickerState.selectedPhotoUrl = null;

        this.setState({
            previewPhotoId: newId,
            previewPhotoUrl: newUrl,
            photoPicker: photoPickerState
        });
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

    handleTogglePhotoPickerOpenState = (event) => {
        event.preventDefault();

        let photoPickerState = this.state.photoPicker;
        photoPickerState.isOpen = !photoPickerState.isOpen;
        this.setState({ photoPicker: photoPickerState });
    }

    isExistingRecipeWithChanges = () => {
        if(this.state.existingRecipe !== true) { return false; }

        if(
            this.state.description !== this.state.priorRecipeState.description || 
            this.state.featured !== this.state.priorRecipeState.featured || 
            this.state.previewPhotoId !== this.state.priorRecipeState.previewPhotoId || 
            this.state.title !== this.state.priorRecipeState.title
        ){ 
            return true; 
        }

        if(
            arraysHaveMatchingValues(this.state.ingredients, this.state.priorRecipeState.ingredients) === false ||
            arraysHaveMatchingValues(this.state.sections, this.state.priorRecipeState.sections) === false
        ){ 
            return true; 
        }
        
        return false;
    }

    mapIngredientInputs = (ingredientList) => {
        return ingredientList.map((item, index) => {
            return (
            // [NOTE][OPTIMIZE] Proper key is needed
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
            // [NOTE][OPTIMIZE] Proper key is needed
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

    renderPreviewPhotoControl = () => {
        const { previewPhotoId, previewPhotoUrl, photoPicker: { isOpen, selectedPhotoId } } = this.state;

        if(previewPhotoId && !previewPhotoUrl) { this.attemptPreviewImageUrlFetch(); }

        return(
            <div className="preview-photo">
                <label>
                    Preview Photo
                    <br/>
                    { isOpen === true
                    ?
                        <PhotoPicker 
                            changeSelectedPhotoId={this.handleChangeSelectedPhotoId}
                            changeSelectedPhotoUrl={this.handleChangeSelectedPhotoUrl}
                            selectedPhotoId={selectedPhotoId}
                            handleCancelForExport={this.handleTogglePhotoPickerOpenState}
                            handleUsePhotoForExport={this.handlePreviewPhotoIdChange}
                        />
                    :
                        <Fragment>
                            { previewPhotoId
                                ? <img src={this.state.previewPhotoUrl} />
                                : '(No photo chosen)'
                            }
                            <br />
                            <button onClick={this.handleTogglePhotoPickerOpenState}>
                                { previewPhotoId ? 'Change' : 'Select' }
                            </button>
                            { previewPhotoId &&
                                <button onClick={this.handleClearPreviewPhoto}>
                                    Use No Photo
                                </button>
                            }
                        </Fragment>
                    }
                </label>
            </div>
        );
    }

    componentDidMount () {
        if(this.props.recipeId) {
            axios.get(`/api/v1/recipes/${this.props.recipeId}`, { 
                params: {
                    id: this.props.recipeId
                }
            })
            .then(res => {
                const sectionsData = mapSectionsData(res);
                const attributes = res.data.data.attributes;
                
                this.setState({
                    description: attributes.description,
                    existingRecipe: true,
                    featured: attributes.featured,
                    ingredients: attributes.ingredients,
                    previewPhotoId: attributes.preview_photo_id,
                    previewPhotoUrl: null,
                    priorRecipeState: {
                        description: attributes.description,
                        featured: attributes.featured,
                        ingredients: attributes.ingredients,
                        previewPhotoId: attributes.preview_photo_id,
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
                    <ValidationErrorDisplay 
                        errorsObject = {this.state.errors}
                        propertyName = "title"
                    />
                </label>
                <br />
                { this.renderPreviewPhotoControl() }
                <br />
                <label>
                    Description
                    <textarea 
                        className="description-input"
                        maxLength={BackendConstants.models.recipe.validations.description.maximum} 
                        onChange={this.handleDescriptionInputChange}
                        type="textarea"
                        value={this.state.description}
                    />
                    <ValidationErrorDisplay 
                        errorsObject = {this.state.errors}
                        propertyName = "description"
                    />
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
                { this.state.photoPicker.isOpen === false &&
                    <Fragment>
                        <hr />
                        <button onClick={this.handleFormSubmit}>
                            {this.state.existingRecipe === true ? 'Update' : 'Create'}
                        </button>
                        <button onClick={this.props.handleClose}>Close</button>
                        <UnsavedChangesDisplay 
                            hasUnsavedChanges={this.isExistingRecipeWithChanges() === true}
                        />
                    </Fragment>
                }
            </form>
        )
    }
}

export default RecipeForm
