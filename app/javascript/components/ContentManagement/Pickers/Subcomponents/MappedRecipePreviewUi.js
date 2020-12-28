import React, { Fragment } from 'react'

export function MappedRecipePreviewUi (props) {    
    const { itemData } = props;
    const { id, attributes: { description, feature, title } } = itemData;

    return (
        <Fragment>
            <div className="id-column">ID: {id}</div>
            <div>Title: {title}</div>
            <div>Description: {description}</div>
            <div>Featured: {featured === true ? '☑': '☐'}</div>
        </Fragment>
    );
}
export default MappedRecipePreviewUi