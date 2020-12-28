import React from 'react'
import { paramCase } from 'change-case';

export function SelectedMappedPreviewControls (props) {
    // [NOTE] There is currently not error checking for all props
    const { itemName, onDeleteButtonPress, onEditButtonPress, onPreviewSelect } = props;

    return(
        <div className={`selected-item-controls ${paramCase(itemName)}`}>
            <button onClick={onEditButtonPress}>
                Modify
            </button>
            <button onClick={onDeleteButtonPress}>
                Delete
            </button>
            <button onClick={(event) => onPreviewSelect(event, null)}>
                Cancel
            </button>
        </div>
    );
}
export default SelectedMappedPreviewControls