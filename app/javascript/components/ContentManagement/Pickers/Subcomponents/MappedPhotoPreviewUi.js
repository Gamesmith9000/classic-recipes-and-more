import React, { Fragment } from 'react'

export function MappedPhotoPreviewUi (props) {    
    const { itemData } = props;
    const { id, attributes: { file, tag, title } } = itemData;

    return (
        <Fragment>
            <div className="id-column">ID: {id}</div>
            <div>Title: {title}</div>
            <div>Tag: {tag}</div>
            <div>
                Image: 
                {/* [HARD CODED][REFACTOR] These needs to be converted into shared type of image component] */}
                <img src={file.small.url} />
            </div>
        </Fragment>
    );
}
export default MappedPhotoPreviewUi