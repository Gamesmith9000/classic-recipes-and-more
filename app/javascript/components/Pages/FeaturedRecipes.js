import React, { Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

import VersionedPhoto from '../Misc/VersionedPhoto'
import BackendConstants from '../Utilities/BackendConstants'
import { isValuelessFalsey } from '../Utilities/Helpers'
import { convertResponseForState } from '../Utilities/ResponseDataHelpers'
import RecipeDisplay from './Displays/RecipeDisplay';

//[NOTE][REFACTOR] This component gets all the photo urls for a photo. This needs to hang on to the size needed for the size shown in recipe display
//      Props example for this component:           displayPhotoVersion="medium" previewPhotoVersion="small"
//      - displayPhotoVersion prop will be passed into the individual recipe display component

class FeaturedRecipes extends React.Component {
    constructor () {
        super();
        this.state = {
            recipes: null,
        };
    }

    mappedRecipePreviews = () => {
        return this.state.recipes.map((element) => {
            return (
                <li className="recipe-preview" key={element.id}>
                    {/* <h2>{element.title}</h2> */}
                    <h2><Link to={`/featured-recipes/${element.id}`}>{element.title}</Link></h2>
                    { this.renderPreviewPhoto(element) }
                    <p>{element.description}</p>
                </li>
            );
        });
    }

    renderPreviewPhoto(recipeData) {
        if(!recipeData || recipeData.length < 1 || !this.state.photoData) { return; }

        const photoId = recipeData?.preview_photo_id;
        if(isValuelessFalsey(photoId) === true) { return; }

        const index = this.state.photoData.findIndex((photo) => photo.id === photoId);
        if(index === -1) { return; }

        return <VersionedPhoto 
            uploadedFileData={this.state.photoData[index].file}
            uploadedFileVersionName={this.props.previewPhotoVersion}
            renderNullWithoutUrl={true}
        />;
    }

    componentDidMount () {
        axios.get('/api/v1/recipes/featured.json')
        .then(res => {
            const { data, included } = res.data;

            // Map data into a more friendly format
            const recipesData = data.map((element) => {
                const { attributes, relationships } = element;
                const parsedId = parseInt(element.id);

                // removed items that belong to other recipes
                const relevantIncluded = included.filter((incItem) => {
                    return (parsedId === parseInt(incItem.relationships.recipe?.data?.id));
                });

                const conversion = convertResponseForState({ data: { attributes, id: parsedId, relationships }, included: relevantIncluded });
                delete conversion.associationPropertyNames;
                delete conversion.photoId;
                return conversion;
            });

            this.setState({ recipes: recipesData });
        })
        .catch(err => console.log(err))
    }

    render() {
        const idParam = parseInt(this.props.match?.params?.id);
        const hasFocusedRecipeId = isValuelessFalsey(idParam, false) === false;
        const displayedRecipeIndex = this.state.recipes?.findIndex(element => element.id === idParam);
        const hasValidFocusIndex = displayedRecipeIndex > -1; 
        
        if(this.state.recipes && isNaN(idParam) === false && hasFocusedRecipeId !== hasValidFocusIndex) { return <Redirect to="/featured-recipes" />; }

        const recipeDisplayAdditionalProps = { photoVersion: this.props.displayPhotoVersion };

        if(hasValidFocusIndex === true && hasFocusedRecipeId === true) {
            const previewPhotoId = this.state.recipes[displayedRecipeIndex].preview_photo_id;
            if(isValuelessFalsey(previewPhotoId) === false) {
                const index = this.state.photoData.findIndex(element => element.id === previewPhotoId);
                if(index > -1) { 
                    recipeDisplayAdditionalProps.previewPhotoUrl = BackendConstants.uploaders.safelyGetUploader('photo').getUrlForVersion(this.state.photoData[index].file, this.props.displayPhotoVersion);
                }
            }
        }

        return (
            <div className="featured-recipes">
                { hasValidFocusIndex === false || hasFocusedRecipeId === false
                ?
                    <Fragment>
                        <h1>Featured Recipes</h1>
                        { this.state.recipes &&
                            <ul className="featured-list">{ this.mappedRecipePreviews() }</ul>
                        }
                    </Fragment>
                :
                    <Fragment>
                        <Link to="/featured-recipes/"> Back to Featured Recipes </Link>
                        <RecipeDisplay {...this.state.recipes[displayedRecipeIndex]} {...recipeDisplayAdditionalProps} />
                    </Fragment>
                }
                
            </div>
        );
    }
}

export default FeaturedRecipes
