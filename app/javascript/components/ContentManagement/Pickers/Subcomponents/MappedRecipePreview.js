import React, { Fragment } from 'react'
import { isValuelessFalsey } from '../../../Utilities/Helpers'

export function MappedRecipePreview(props) {
    const { itemData, selectedItemId } = props;

    // props are not null checked

    const isSelected = (isValuelessFalsey(selectedItemId) === false && selectedItemId === parseInt(itemData.id));
    const commonItems = (
        <Fragment>
            <div className="id-column">ID: {itemData.id}</div>
            <div>Title: {itemData.attributes.title}</div>
            <div>Description: {itemData.attributes.description}</div>
            <div>Featured: {itemData.attributes.featured === true ? '☑': '☐'}</div>
        </Fragment>
    );
    if(isSelected === true) {
        return (
        <li className="recipe-preview selected" key={itemData.id} >
            <div className='selected-preview-item-buttons'>
                <button onClick={props.handleModifyRecipeButtonInput}>
                    Modify
                </button>
                <button onClick={props.handleDeleteRecipeButtonInput}>
                    Delete
                </button>
                <button onClick={(event) => handlePreviewSelect(event, null)}>
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
            key={itemData.id}
            onClick={(event) => this.handlePreviewSelect(event, itemData.id)}
        >
            { commonItems }
        </li>
    );
}
export default MappedRecipePreview