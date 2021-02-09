import React, { Fragment } from 'react'

export function RecipeDestroyerUi(props) {    
    const { itemData, onClose, onDestroyButtonPress } = props;
    const { id, attributes: { description, title } } = itemData;

    return (
        <Fragment>
            <h3>You are about to delete a recipe:</h3>
            <p>ID: {id}</p>
            <p>Title: {title}</p>
            <p>Description: {description}</p>
            <button onClick={onDestroyButtonPress}>Delete</button>
            <button onClick={onClose}>Cancel</button>
        </Fragment>
    );
}
export default RecipeDestroyerUi