import React, { Fragment } from 'react'
import { isValuelessFalsey } from '../../../Utilities/Helpers'
import SelectedMappedPreviewControls from './SelectedMappedPreviewControls'

export function MappedRecipePreview(props) {
    // [NOTE] There is currently not error checking for all props
    
    const { itemData, onDeleteButtonPress, onEditButtonPress, onPreviewSelect, selectedItemId } = props;

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
        <li className="recipe item-preview selected" key={itemData.id} >
            <SelectedMappedPreviewControls 
                key={itemData.id}
                itemName="recipe"
                onDeleteButtonPress={onDeleteButtonPress}
                onEditButtonPress={onEditButtonPress}
                onPreviewSelect={onPreviewSelect}
            />
            { commonItems }
        </li>
        );
    }

    return (
        <li 
            className="recipe item-preview" 
            key={itemData.id}
            onClick={(event) => onPreviewSelect(event, itemData.id)}
        >
            { commonItems }
        </li>
    );
}
export default MappedRecipePreview