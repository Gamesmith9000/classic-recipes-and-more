import React, { Fragment } from 'react'

export function PhotoDestroyerUi(props) {
    // [NOTE] There is currently not error checking for all props
    
    const { onClose, onDestroyButtonPress, itemData, selectedItemId } = props;
    const { id, attributes: { file, tag, title } } = itemData;

    return (
        <Fragment>
            <h3>You are about to delete a photo:</h3>
            <div className="id-column">ID: {id}</div>
            <div>Title: {title}</div>
            <div>Tag: {tag}</div>
            <div>
                Image: 
                {/* [HARD CODED][REFACTOR] These needs to be converted into shared type of image component] */}
                <img src={file.small.url} />
            </div>
            <button onClick={onDestroyButtonPress}>Delete</button>
            <button onClick={onClose}>Cancel</button>
        </Fragment>
    );
}
export default PhotoDestroyerUi