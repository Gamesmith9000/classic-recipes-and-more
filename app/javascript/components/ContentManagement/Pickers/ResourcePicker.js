import axios from 'axios'
import React, { Fragment } from 'react'
import { paramCase, snakeCase } from 'change-case';
import PickerSortSelect from './Subcomponents/PickerSortSelect'
import { EmptyPickerEntriesDisplay} from '../../Utilities/ComponentHelpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../Utilities/ResponseDataHelpers'

class ResourcePicker extends React.Component {
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
        const { additionalMappedItemPreviewProps, mappedItemPreviewComponent, onDeleteButtonPress, onEditButtonPress, selectedItemId } = this.props;
        if(!itemDataList || !mappedItemPreviewComponent ) { return null; }

        const { byId, fieldIndex, validFields } = this.state.sorting;
        const sortedItemDataList = sortByAttributeNameOrId(itemDataList, validFields, fieldIndex, byId);

        const mappedPreviews = sortedItemDataList.map((item, index) => { 
            const mappedItemProps = {
                ...additionalMappedItemPreviewProps, 
                itemData: item,
                key: item.id,
                mappedIndex: index,
                onDeleteButtonPress: onDeleteButtonPress,
                onEditButtonPress: onEditButtonPress,
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
        const { itemName, subcomponentKey } = this.props;
        const pickerClassName = `${paramCase(itemName)}-picker`;

        // Before the component mounts, itemData is null. Afterward, it will be an array (even if empty)
        return (
            <div className={pickerClassName}>
                { this.state.itemData &&
                    <Fragment>
                        { this.state.itemData.length === 0  
                            ? 
                                <EmptyPickerEntriesDisplay entryTypeName={itemName} key={subcomponentKey} />
                            : 
                                <Fragment>
                                    <PickerSortSelect 
                                        itemName={itemName}
                                        key={subcomponentKey}
                                        onSortingStateChange={(newSortingState) => this.setState({ sorting: newSortingState})}
                                        sortingState={this.state.sorting}
                                    />
                                    { this.mapItemPreviews(this.state.itemData, paramCase(itemName)) }
                                </Fragment>
                        }
                    </Fragment>
                }
            </div>
        )
    }
}

export default ResourcePicker
