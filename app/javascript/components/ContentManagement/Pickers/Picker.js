import axios from 'axios'
import React, { Fragment } from 'react'
import { paramCase, snakeCase } from 'change-case';
import PickerSortSelect from './Subcomponents/PickerSortSelect'
import { EmptyPickerEntriesDisplay} from '../../Utilities/ComponentHelpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../Utilities/ResponseDataHelpers'

class Picker extends React.Component {

    // To add: Storing of sorting data in localStorage
    //  - Do not store the 'validFields' or ignoredFields though, as this is problematic
    //  - Do store 'byId'(bool), 'fieldIndex'(int), as well as a string for fieldName 
    //      - string is to verify verify that index still matches up to proper spot
    //          - Otherwise, 
    //  ~ Helpers needs to have methods to help pack and unpack localStorage (similar to approach in other components)
    //      - In the unpack method, maybe even have an option to return null if the item doesn't exist in localStorage
    //      - Maybe even a non-rendered component (if that is a thing). Maybe a custom hook?
    //  - Will also have make separate function to pass into onSortingStateChange, as the localStorage will need to be updated just before state
    //  - Instead of checking if component mounted, could check if itemData is null (only happens if unmounted or errors during mounting)

    constructor () {
        super();
        this.state = {
            itemData: null,
            sorting: {
                byId: true,
                fieldIndex: 0,
                validFields: []
            }
        }
    }

    handlePreviewSelect = (event, itemId) => {
        event.preventDefault();
        this.props.onSelectedItemIdChange(parseInt(itemId));
    }

    mapItemPreviews = (itemDataList, singleItemClassName) => {
        const { additionalMappedItemPreviewProps, mappedItemPreviewComponent, selectedItemId } = this.props;
        if(!itemDataList || !mappedItemPreviewComponent ) { return null; }

        const { byId, fieldIndex, validFields } = this.state.sorting;
        const sortedItemDataList = sortByAttributeNameOrId(itemDataList, validFields, fieldIndex, byId);

        const mappedPreviews = sortedItemDataList.map((item, index) => { 
            const mappedItemProps = {
                ...additionalMappedItemPreviewProps, 
                itemData: item,
                key: item.id,
                mappedIndex: index,
                onPreviewSelect: this.handlePreviewSelect,
                selectedItemId: selectedItemId
            };

            return mappedItemPreviewComponent(mappedItemProps)
        });

        return (
            <ul className={`${singleItemClassName}-previews-list`}>
                { mappedPreviews }
            </ul>
        );
    }

    // To do: Add any localStorage implementation here (see top notes)
    componentDidMount () {
        const { alternateGetUri, itemName, nonSortByFields } = this.props;
        const resource = alternateGetUri ? alternateGetUri : snakeCase(itemName + 's');

        axios.get(`/api/v1/${resource}.json`)
        .then(res => {
            const validIgnoreProps = (nonSortByFields && Array.isArray(nonSortByFields) === true);
            const ignoredSortingFields = validIgnoreProps === true ? nonSortByFields : [];

            const sortingState = this.state.sorting;
            sortingState.validFields = getSortablePropertyNamesFromAttributes(res.data.data, ignoredSortingFields);

            this.setState({
                itemData: res.data.data,
                sorting: sortingState
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        const { itemName } = this.props;
        const itemClassName = `${paramCase(itemName)}-picker`;

        // Before the component mounts, itemData is null. Afterward, it will be an array (even if empty)
        return (
            <div className={itemClassName}>
                { this.state.itemData &&
                    <Fragment>
                        { this.state.itemData.length === 0  
                            ? 
                                <EmptyPickerEntriesDisplay entryTypeName={itemName} />
                            : 
                                <Fragment>
                                    <PickerSortSelect 
                                        itemName={itemName}
                                        key={itemName}
                                        onSortingStateChange={(newSortingState) => this.setState({ sorting: newSortingState})}
                                        sortingState={this.state.sorting}
                                    />
                                    { this.mapItemPreviews(this.state.itemData, itemClassName) }
                                </Fragment>
                        }
                    </Fragment>
                }
            </div>
        )
    }
}

export default Picker
