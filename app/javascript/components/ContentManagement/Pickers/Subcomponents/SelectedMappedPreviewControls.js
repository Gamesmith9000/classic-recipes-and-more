import React, { Fragment } from 'react'
import { paramCase } from 'change-case';

export function SelectedMappedPreviewControls (props) {
    // [NOTE] There is currently not error checking for all props
    const { auxButtonText, hideEditAndDeleteButtons, itemName, onAuxButtonPress, onDeleteButtonPress, onEditButtonPress, onPreviewSelect } = props;
    const useAuxButton = auxButtonText && hideEditAndDeleteButtons;

    return (
        <div className={`selected-item-controls ${paramCase(itemName)}`}>
            { (useAuxButton === true || useAuxButton === 'true') &&
                <button onClick={onAuxButtonPress}>
                    {auxButtonText}
                </button>
            }
            { !hideEditAndDeleteButtons &&
                <Fragment>
                    <button onClick={onEditButtonPress}>
                        Modify
                    </button>
                    <button onClick={onDeleteButtonPress}>
                        Delete
                    </button>
                </Fragment>
            }
            <button onClick={(event) => onPreviewSelect(event, null)}>
                Cancel
            </button>
        </div>
    );
}
export default SelectedMappedPreviewControls