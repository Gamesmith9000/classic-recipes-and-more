import axios from 'axios'
import React, { Fragment } from 'react'
import { paramCase, snakeCase } from 'change-case';
import PickerSortSelect from './Subcomponents/PickerSortSelect'
import { EmptyPickerEntriesDisplay} from '../../Utilities/ComponentHelpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../Utilities/ResponseDataHelpers'

class Picker extends React.Component {

    // To add: Storing of sorting data in localStorage
    //  - Do not store the 'validFields' or ignoredFields though, as this is problematic
    //  - Do store 'byId'(bool), 'fieldIndex'(int), as well as a string for fieldName 
    //      - string is to verify verify that index still matches up to proper spot
    //          - Otherwise, 
    //  ~ Helpers needs to have methods to help pack and unpack localStorage (similar to approach in other components)
    //      - In the unpack method, maybe even have an option to return null if the item doesn't exist in localStorage
    //      - Maybe even a non-rendered component (if that is a thing). Maybe a custom hook?
    //  - Will also have make separate function to pass into onSortingStateChange, as the localStorage will need to be updated just before state
    //  - Instead of checking if component mounted, could check if itemData is null (only happens if unmounted or errors during mounting)

    constructor () {
        super();
        this.state = {
            itemData: null,
            sorting: {
                byId: true,
                fieldIndex: 0,
                ignoredFields: [],
                validFields: []
            }
        }
    }

    handlePreviewSelect = (event, itemId) => {
        event.preventDefault();
        this.props.changeSelectedItemId(parseInt(itemId));
    }

    mapItemPreviews = (itemDataList) => {
        this.mapRecipePreviews(itemDataList);
    }

    // Rebuild this method. It will accept a prop of the lowest mapped function (which will likely be used with custom subcomponents for each implementation)
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
                <li className="recipe-preview selected" key={item.id} >
                    <div className='selected-preview-item-buttons'>
                        <button onClick={this.props.handleModifyRecipeButtonInput}>
                            Modify
                        </button>
                        <button onClick={this.props.handleDeleteRecipeButtonInput}>
                            Delete
                        </button>
                        <button onClick={(event) => this.handlePreviewSelect(event, null)}>
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
                    key={item.id}
                    onClick={(event) => this.handlePreviewSelect(event, item.id)}
                >
                    { commonItems }
                </li>
            );
        });

        return (
            <ul className="recipe-previews-list">{mappedRecipePreview}</ul>
        );
    }

    // TO DO (componentDidMount)
    //  - Phase out recipeData
    //  - Initialize fields that will be ignored as sorting fields
    //  - Phase in new routes approach (and possibly optional field for differing resource name)
    //  - Later, add any localStorage implementation (see top notes)
    
    componentDidMount () {
        const { itemName, nonSortByFields } = this.props;

        axios.get('/api/v1/recipes.json')
        .then(res => {
            // let to const?
            let sortingState = this.state.sorting;
            sortingState.validFields = getSortablePropertyNamesFromAttributes(res.data.data, sortingState.ignoredFields);

            this.setState({
                itemData: res.data.data,
                sorting: sortingState
            });
        })
        .catch(err => console.log(err));
    }

    // To do: 
    render() {
        const { itemName } = this.props;
        const itemClassName = `${paramCase(itemName)}-picker`;

        // Before the component mounts, itemData is null. Afterward, it will be an array (even if empty)
        return (
            <div className={itemClassName}>
                { this.state.itemData &&
                    <Fragment>
                        { this.state.itemData.length === 0  
                            ? 
                                <EmptyPickerEntriesDisplay entryTypeName={itemName} />
                            : 
                                <Fragment>
                                    <PickerSortSelect 
                                        itemName={itemName}
                                        key={itemName}
                                        onSortingStateChange={(newSortingState) => this.setState({ sorting: newSortingState})}
                                        sortingState={this.state.sorting}
                                    />
                                    { this.mapItemPreviews(this.state.itemData) }
                                </Fragment>
                        }
                    </Fragment>
                }
            </div>
        )
    }
}

export default Picker
