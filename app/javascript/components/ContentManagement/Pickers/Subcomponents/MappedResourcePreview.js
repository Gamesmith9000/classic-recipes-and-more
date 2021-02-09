import { paramCase } from 'change-case';
import React from 'react'
import { isValuelessFalsey } from '../../../Utilities/Helpers'
import SelectedMappedPreviewControls from './SelectedMappedPreviewControls'

export function MappedResourcePreview (props) {
    // [NOTE] There is currently not error checking for all props
    
    const { onDeleteButtonPress, onEditButtonPress, onPreviewSelect, previewKeyBase } = props;
    const { itemData, itemName, mappedPreviewUiComponent, selectedItemId } = props;

    const parsedId = parseInt(itemData.id);
    const isSelected = (isValuelessFalsey(selectedItemId) === false && selectedItemId === parsedId);
    
    const liClassSuffix = isSelected === true ? 'preview selected' : 'preview';
    const liClassName = `${paramCase(itemName)} item-${liClassSuffix}`;

    const handleClick = (event, parsedId) => {
        if(isSelected === false) { onPreviewSelect(event, parsedId) }
        else { event.preventDefault(); }
    }
    
    const { auxButtonText, hideEditAndDeleteButtons, onAuxButtonPress } = props;
    const additionalPreviewControlProps = {
        auxButtonText: auxButtonText,
        hideEditAndDeleteButtons: hideEditAndDeleteButtons,
        onAuxButtonPress: onAuxButtonPress
    }

    return (
        <li className={liClassName} onClick={(event) => handleClick(event, parsedId)} >
            { isSelected === true &&
                <SelectedMappedPreviewControls 
                    {...additionalPreviewControlProps}
                    key={previewKeyBase + 'sc-' + parsedId}
                    itemName="product"
                    onDeleteButtonPress={onDeleteButtonPress}
                    onEditButtonPress={onEditButtonPress}
                    onPreviewSelect={onPreviewSelect}
                />
            }
            { mappedPreviewUiComponent({ itemData }, previewKeyBase + 'ui-' + parsedId) }
        </li>
    );
}
export default MappedResourcePreview