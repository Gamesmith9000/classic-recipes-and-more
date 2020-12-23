import React from 'react'
import { paramCase, capitalCase } from 'change-case';

function PickerSortSelect(props) {
    const { itemName, onSortingStateChange, sortingState } = props;

    // Currently no error checking

    const itemId = `${paramCase(itemName)}-sort-select`

    const handleInputChange = (event) => {
        event.preventDefault();

        const newValue = event.target.value;
        let newSortingState = sortingState;

        newSortingState.byId = newValue === 'id';

        if(newSortingState.byId === false && sortingState.validFields.includes(newValue)) {
            newSortingState.fieldIndex = sortingState.validFields.indexOf(newValue);
        }

        onSortingStateChange(newSortingState);
    }

    const sortingAttributeOptions = sortingState.validFields.map((item) => {
        return (
            <option key={item} value={item}>
                { capitalCase(item) }
            </option>
        );
    });

    return (
        <div className="picker-sort-select">
            <label htmlFor={itemId}>Sort By: </label>
            <select id={itemId} onChange={handleInputChange} >
                <option value="id">ID</option>
                {sortingAttributeOptions}
            </select>
        </div>
    );
}

export default PickerSortSelect