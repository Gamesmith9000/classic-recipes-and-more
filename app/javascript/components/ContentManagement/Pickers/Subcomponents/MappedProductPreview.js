import React, { Fragment } from 'react'
import { isValuelessFalsey } from '../../../Utilities/Helpers'
import SelectedMappedPreviewControls from './SelectedMappedPreviewControls'
export function MappedProductPreview (props) {
    // [NOTE] There is currently not error checking for all props
    
    const { itemData, onDeleteButtonPress, onEditButtonPress, onPreviewSelect, selectedItemId } = props;
    const { id, attributes: { description, price, stock, title, total_sold }, relationships: { product_photo }} = itemData;

    if(product_photo) { console.log('Product Photos rendering is not yet implemented here.') }
    const renderProductPhoto = product_photo.data ? <Fragment>RENDER PRODUCT PHOTO HERE</Fragment> : null;

    const isSelected = (isValuelessFalsey(selectedItemId) === false && selectedItemId === parseInt(id));
    const commonItems = (
        <Fragment>
            <div className="id-column">ID: {id}</div>
            <div>Title: {title}</div>
            <div>Description: {description}</div>
            { renderProductPhoto }
        </Fragment>
    );
    if(isSelected === true) {
        return (
            <li className="product item-preview selected" key={id} >
                <SelectedMappedPreviewControls 
                    key={id}
                    itemName="product"
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
            className="product item-preview" 
            key={id}
            onClick={(event) => onPreviewSelect(event, id)}
        >
            { commonItems }
        </li>
    );
}
export default MappedProductPreview