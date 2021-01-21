import axios from 'axios'
import React, { Fragment } from 'react'
import { paramCase, snakeCase } from 'change-case';
import PickerSortSelect from './Subcomponents/PickerSortSelect'
import { EmptyPickerEntriesDisplay} from '../../Utilities/ComponentHelpers'
import { getSortablePropertyNamesFromAttributes, sortByAttributeNameOrId } from '../../Utilities/ResponseDataHelpers'
import MappedResourcePreview from './Subcomponents/MappedResourcePreview';
import { isValuelessFalsey } from '../../Utilities/Helpers';

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

        const parsedItemId = parseInt(itemId);
        if(parseInt(this.props.selectedItemId) === parsedItemId) { return; }
        this.props.onSelectedItemIdChange(parsedItemId);
    }

    mapItemPreviews = (itemDataList, singleItemClassName) => {
        if(!itemDataList || ! this.props.mappedPreviewUiComponent ) { return null; }

        const { itemName, subcomponentKey } = this.props;
        const { additionalMappedItemPreviewProps, mappedPreviewUiComponent, onDeleteButtonPress, onEditButtonPress, selectedItemId } = this.props;

        const { byId, fieldIndex, validFields } = this.state.sorting;
        const sortedItemDataList = sortByAttributeNameOrId(itemDataList, validFields, fieldIndex, byId);

        const previewKeyBase = `${subcomponentKey}-mp-`;

        const mappedPreviews = sortedItemDataList.map((item, index) => { 
            const mappedItemProps = {
                ...additionalMappedItemPreviewProps, 
                itemData: item,
                itemName: itemName,
                mappedIndex: index,
                mappedPreviewUiComponent: mappedPreviewUiComponent,
                onDeleteButtonPress: onDeleteButtonPress,
                onEditButtonPress: onEditButtonPress,
                onPreviewSelect: this.handlePreviewSelect,
                selectedItemId: selectedItemId,
                previewKeyBase: previewKeyBase
            };

            return (
                <MappedResourcePreview 
                    {...mappedItemProps}
                    key={previewKeyBase + item.id}
                />
            )
        });

        return (
            <ul className={`${singleItemClassName} previews-list`}>
                { mappedPreviews }
            </ul>
        );
    }

    componentDidMount () {
        const { alternateIndexUrl, itemName, nonSortByFields } = this.props;
        const indexUrl = alternateIndexUrl ? alternateIndexUrl : `/api/v1/${snakeCase(itemName + 's')}.json`

        axios.get(indexUrl)
        .then(res => {
            if(res.data.data.length > 0) {
                const validIgnoreProps = (nonSortByFields && Array.isArray(nonSortByFields) === true);
                const ignoredSortingFields = validIgnoreProps === true ? nonSortByFields : [];

                const sortingState = this.state.sorting;
                sortingState.validFields = getSortablePropertyNamesFromAttributes(res.data.data, ignoredSortingFields);

                // When using onDataFetched prop, beware later state changes
                const { onDataFetched } = this.props;
                if(onDataFetched) { onDataFetched(res.data.data); }

                this.setState({
                    itemData: res.data.data,
                    sorting: sortingState
                });
            }
            else { this.setState({ itemData: []})}
        })
        .catch(err => console.log(err));
    }

    render() {
        const { additionalClassNames, itemName, subcomponentKey } = this.props;
        const pickerClassName = `${paramCase(itemName)} resource-picker` + (isValuelessFalsey(additionalClassNames) === true ? '' : ` ${additionalClassNames}`);

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
