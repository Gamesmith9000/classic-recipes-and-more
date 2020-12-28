import React, { Fragment } from 'react'

export function MappedProductPreviewUi (props) {
    const { itemData } = props;
    const { id, attributes: { description, price, stock, title, total_sold }, relationships: { product_photo }} = itemData;

    if(product_photo) { console.log('Product Photos rendering is not yet implemented here.') }
    const renderProductPhoto = product_photo.data ? <Fragment>RENDER PRODUCT PHOTO HERE</Fragment> : null;
    
    return (
        <Fragment>
            <div className="id-column">ID: {id}</div>
            <div>Title: {title}</div>
            <div>Description: {description}</div>
            { renderProductPhoto }
        </Fragment>
    );
}
export default MappedProductPreviewUi
