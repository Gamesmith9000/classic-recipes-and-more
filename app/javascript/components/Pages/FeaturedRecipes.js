import React, { isValidElement } from 'react'
import axios from 'axios'
import qs from 'qs'
import { BackendConstants, isValuelessFalsey } from '../Utilities/Helpers'

//[NOTE][REFACTOR] This component gets all the photo urls for a photo. This needs to hang on to the size needed for the size shown in recipe display
//      Props example for this component:           displayPhotoVersion="medium" previewPhotoVersion="small"
//      - displayPhotoVersion prop will be passed into the individual recipe display component

class FeaturedRecipes extends React.Component {
    constructor () {
        super();
        this.state = {
            photoData: null,
            recipes: null
        };
    }

    mappedRecipePreviews = () => {
        return this.state.recipes.map((element) => {
            return (
                <li className="recipe-preview" key={element.id}>
                    <h2>{element.title}</h2>
                    { this.renderPreviewPhoto(element) }
                    <p>{element.description}</p>
                </li>
            );
        });
    }

    renderPreviewPhoto(recipeData) {
        const photoId = recipeData?.preview_photo_id;
        if(isValuelessFalsey(photoId) === true){ return; }

        const index = this.state.photoData.findIndex((element) => element.photoId === photoId);
        if(index === -1) { return; }
        const url = this.state.photoData[index].photoUrl;

        return <img src={url} />;
    }

    componentDidMount () {
        axios.get('/api/v1/recipes/featured.json')
        .then(res => {
            const { data, included } = res.data;

            // Map recipe and section data into a more friendly format

            const recipesData = data.map((element, index) => {
                const attributes = element.attributes;
                const id = parseInt(element.id);
                const sections = element.relationships.sections.data.map((sectionElement) => {
                    const sectionId = sectionElement.id;
                    const includedIndex = included.findIndex(value => value.id === sectionId);
                    return includedIndex !== -1 ? included[includedIndex].attributes : null;
                });
                return { ...attributes, id, sections };
            });

            let targetRecipeIds = recipesData.map((element) => { return element.preview_photo_id; });

            while(targetRecipeIds.some((element) => isValuelessFalsey(element) === true)) {
                const index = targetRecipeIds.findIndex((element) => isValuelessFalsey(element) === true);
                targetRecipeIds.splice(index, 1);
            }

            let config = {
                params: { photos: { ids: targetRecipeIds } },
                paramsSerializer: (params) => { return qs.stringify(params); }
            }

            axios.get('/api/v1/photos/multi.json', config)
            .then(res => {
                // [NOTE] 'ids' param length and return length are expected to be the same length. No special checks are done

                const photoData = res.data.data.map((element, index) => {
                    const photoId = targetRecipeIds[index];
                    const photoUrl = BackendConstants.photoUploader.getUrlForVersion(element.attributes.file, this.props.previewPhotoVersion);                    
                    return { photoId, photoUrl };
                });

                this.setState({
                    photoData: photoData,
                    recipes: recipesData
                });
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="featured-recipes">
                <h1>Featured Recipes</h1>
                { this.state.recipes &&
                    <ul className="featured-list">{ this.mappedRecipePreviews() }</ul>
                }
            </div>
        )
    }
}

export default FeaturedRecipes
