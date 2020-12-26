import React, { Fragment } from 'react'
import { isValuelessFalsey } from '../../../Utilities/Helpers'

export function RecipeDestroyerUi(props) {
    // [NOTE] There is currently not error checking for all props
    
    const { itemData, onClose, onDestroyButtonPress, selectedItemId } = props;

    return (
        <Fragment>
            <h3>You are about to delete a recipe:</h3>
            <p>ID: {selectedItemId}</p>
            <p>Title: {itemData.attributes.title}</p>
            <p>Description: {itemData.attributes.description}</p>
            <button onClick={onDestroyButtonPress}>Delete</button>
            <button onClick={onClose}>Cancel</button>
        </Fragment>
    );
}
export default RecipeDestroyerUi