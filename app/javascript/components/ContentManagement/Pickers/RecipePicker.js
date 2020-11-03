import React, { Fragment } from 'react'
import axios from 'axios'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../../ResponseDataHelpers'


class RecipePicker extends React.Component {
    constructor () {
        super();
        this.state = {
            recipeData: null,
            sortById: true,
            sortingFieldIndex: 0,
            validSortingFields: []
            // [NOTE] Can combine sorting state properties into a single object.
            //  Consider housing the array of ignored sorting objects here too
        }
    }

    handleRecipePreviewSelect = (event, recipeID) => {
        event.preventDefault();
        this.props.changeSelectedRecipeId(parseInt(recipeID));
    }

    handleSortingButtonPress = (event) => {
        event.preventDefault();
        this.setState({
            sortById: !this.state.sortById
        });
    }

    mapRecipePreviews = (recipeDataList) => {
        if(!recipeDataList) return;

        const { sortById, sortingFieldIndex, validSortingFields} = this.state;
        const sortedRecipeDataList = sortByAttributeNameOrId(recipeDataList, validSortingFields, sortingFieldIndex, sortById);

        const mappedRecipePreview = sortedRecipeDataList.map((item, index) => {
            const isSelected = (this.props.selectedRecipeId && this.props.selectedRecipeId === parseInt(item.id));
            const commonItems = (
                <Fragment>
                    <div className="id-column">ID: {item.id}</div>
                    <div>Title: {item.attributes.title}</div>
                    <div>Description: {item.attributes.description}</div>
                </Fragment>
            );
            if(isSelected === true) {
                return (
                <li 
                    className="recipe-preview selected" 
                    key={index}
                >
                    <button onClick={this.props.handleModifyRecipeButtonInput}>
                        Modify
                    </button>
                    <button onClick={this.props.handleDeleteRecipeButtonInput}>
                        Delete
                    </button>
                    <button onClick={(event) => this.handleRecipePreviewSelect(event, null)}>
                        Cancel
                    </button>
                    { commonItems }
                </li>
                );
            }

            return (
                <li 
                    className="recipe-preview" 
                    key={index}
                    onClick={(event) => this.handleRecipePreviewSelect(event, item.id)}
                >
                    { commonItems }
                </li>
            );
        });
        // [NOTE] Consider changing li key to something other than index.

        return (
            <ul className="recipe-previews-list">{mappedRecipePreview}</ul>
        );
    }

    componentDidMount () {
        axios.get('/api/v1/recipes')
        .then(res => {
            const ignoredSortingFields = ['ingredients'];
            this.setState({
                recipeData: res.data.data,
                validSortingFields: getSortablePropertyNamesFromAttributes(res.data.data, ignoredSortingFields)
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="recipe-picker">
                <div className="sorting-controls">
                    <div>Sorting By:</div>
                    <button onClick={this.handleSortingButtonPress}>
                        {this.state.sortById === true  ? "ID" : "Title"}
                    </button>
                </div>
                {this.mapRecipePreviews(this.state.recipeData)}
            </div>
        )
    }
}

export default RecipePicker
