import React, { Fragment } from 'react'
import axios from 'axios'
import { EmptyPickerEntriesDisplay} from '../../../ComponentHelpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../../ResponseDataHelpers'

class RecipePicker extends React.Component {
    constructor () {
        super();
        this.state = {
            recipeData: null,
            sorting: {
                byId: true,
                fieldIndex: 0,
                ignoredFields: ['ingredients'],
                validFields: []
            }
        }
    }

    handleRecipePreviewSelect = (event, recipeID) => {
        event.preventDefault();
        this.props.changeSelectedRecipeId(parseInt(recipeID));
    }

    handleSortSelectInputChange = (event) => {
        event.preventDefault();
        const newValue = event.target.value;
        if(newValue === 'id') {
            let sortingState = this.state.sorting;
            sortingState.byId = true;

            this.setState({ sorting: sortingState });
        }
        else {
            if(this.state.sorting.validFields.includes(newValue)) {
                let sortingState = this.state.sorting;
                sortingState.byId = false;
                sortingState.fieldIndex = this.state.sorting.validFields.indexOf(newValue);

                this.setState({ sorting: sortingState });
            }
        }
    }

    mapRecipePreviews = (recipeDataList) => {
        if(!recipeDataList) return;

        const { byId, fieldIndex, validFields} = this.state.sorting;
        const sortedRecipeDataList = sortByAttributeNameOrId(recipeDataList, validFields, fieldIndex, byId);

        const mappedRecipePreview = sortedRecipeDataList.map((item, index) => {
            const isSelected = (this.props.selectedRecipeId && this.props.selectedRecipeId === parseInt(item.id));
            const commonItems = (
                <Fragment>
                    <div className="id-column">ID: {item.id}</div>
                    <div>Title: {item.attributes.title}</div>
                    <div>Description: {item.attributes.description}</div>
                    <div>Featured: {item.attributes.featured === true ? '☑': '☐'}</div>
                </Fragment>
            );
            if(isSelected === true) {
                return (
                <li 
                    className="recipe-preview selected" 
                    // [NOTE][OPTIMIZE] Proper key is needed
                    key={index}
                >
                    <div className='selected-preview-item-buttons'>
                        <button onClick={this.props.handleModifyRecipeButtonInput}>
                            Modify
                        </button>
                        <button onClick={this.props.handleDeleteRecipeButtonInput}>
                            Delete
                        </button>
                        <button onClick={(event) => this.handleRecipePreviewSelect(event, null)}>
                            Cancel
                        </button>
                    </div>
                    { commonItems }
                </li>
                );
            }

            return (
                <li 
                    className="recipe-preview" 
                    // [NOTE][OPTIMIZE] Proper key is needed
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

    mapSortSelectAttributeOptions = () => {
        return this.state.sorting.validFields.map((item) => {
            return (
                // [NOTE][OPTIMIZE] Proper key is needed
                <option key={`map-sortSelectField-recipe-${item}`} value={item}>
                    { item.charAt(0).toUpperCase() + item.slice(1) }
                </option>
            );
        }); 
    }

    renderSortSelect = () => {
        return (
            <Fragment>
                <label htmlFor="recipe-sort-select">Sort By: </label>
                <select 
                    id="recipe-sort-select"
                    onChange={this.handleSortSelectInputChange} 
                >
                    <option value="id">ID</option>
                    { this.mapSortSelectAttributeOptions() }
                </select>
            </Fragment>
        );
    }

    componentDidMount () {
        axios.get('/api/v1/recipes')
        .then(res => {
            let sortingState = this.state.sorting;
            sortingState.validFields = getSortablePropertyNamesFromAttributes(res.data.data, sortingState.ignoredFields)
            this.setState({
                recipeData: res.data.data,
                sorting: sortingState
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="recipe-picker">
                {(!this.state.recipeData || this.state.recipeData.length === 0)
                    ? 
                        <EmptyPickerEntriesDisplay entryTypeName='recipe' />
                    : 
                        <Fragment>
                            { this.mapRecipePreviews(this.state.recipeData) }
                            { this.renderSortSelect() }
                        </Fragment>
                }
            </div>
        )
    }
}

export default RecipePicker
