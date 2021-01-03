import { RecipeFormSectionState } from './Constructors'
import { isValuelessFalsey } from './Helpers';
import { camelCase, snakeCase } from 'change-case'


export function convertResponseForState (responseData) {
    // Pass in response.data from Axios

    const { data: { attributes, id /*, relationships */ }, included } = responseData;
    let conversion = { id: parseInt(id) };

    // Convert 'attributes'
    const attributesKeys = Object.keys(attributes);

    for (let i = 0; i < attributesKeys.length; i++) {
        const attributeValue = attributes[attributesKeys[i]];
        const convertedName = camelCase(attributesKeys[i]);
        conversion[convertedName] = attributeValue;
    }

    // Convert 'included' 
    for (let i = 0; i < included.length; i++) {
        const itemData = {... included[i]};
        const itemConversion = { id: parseInt(itemData.id) };

        const typeAsPlural = camelCase(itemData.type) + 's';
        const itemAttributesKeys = Object.keys(itemData.attributes);

        for (let j = 0; j < itemAttributesKeys.length; j++) {
            const attributeValue = itemData.attributes[itemAttributesKeys[i]];
            const convertedName = camelCase(itemAttributesKeys[i]);
            itemConversion[convertedName] = attributeValue;
        }

        // Create the array if it doesn't yet exist
        if(conversion.hasOwnProperty(typeAsPlural) === false) { conversion[typeAsPlural] = []; }

        conversion[typeAsPlural].push(itemConversion);
    }

    return conversion;
}

function getProperDataForAttributes (res) {
    // Find the location of the proper model data from Axios response, utilizing fast_jsonapi's formatting
    // Requires at least one item in response

    let targetData;
    let invalidResData = isValuelessFalsey(res);
    
    if(invalidResData === false && res[0]?.hasOwnProperty('attributes')) {
        // has res[0].attributes
        targetData = res[0];
    }
    else if(invalidResData === false && res.hasOwnProperty('data')) {
        // has res.data

        if(res.data.hasOwnProperty('data')) {
            // has res.data.data

            if(res.data.data[0]?.hasOwnProperty('attributes')) {
                // has res.data.data[0].attributes
                targetData = res.data.data[0];
            }
            else {
                invalidResData = true;
            }
        }
        else {
            // has res.data

            if(res.data[0]?.hasOwnProperty('attributes')) {
                // has res.data[0].attributes
                targetData = res.data[0];
            }
            else {
                invalidResData = true;
            }
        }
    }
    else {
        invalidResData = true;
    }

    if(invalidResData === true) {
        console.warn('The response data has an invalid format, or is empty');
        return null;
    }

    return targetData;
}

export function getSortablePropertyNamesFromAttributes (res, ignoredPropertiesList = []) {
    // [NOTE] Checking/searching through nested properties is not present, as it
    //          is not needed for current use cases.
    
    const targetData = getProperDataForAttributes(res);

    if(!targetData) {
        console.error('Response data has an invalid format. Cannot proceed.');
        return null;
    }

    const attributes = Object.getOwnPropertyNames(targetData.attributes);
    const isIgnoredProperty = (targetProperty) => {
        if(!ignoredPropertiesList || Array.isArray(ignoredPropertiesList) === false) { return false; }
        else { return ignoredPropertiesList.includes(targetProperty); }
    };

    let validProperties = [];

    for(let i = 0; i < attributes.length; i++) {
        if(!isIgnoredProperty(attributes[i])) {
            validProperties.push(attributes[i]);
        }
    }

    return validProperties;
}

export function mapRecipeSectionsData (responseData) {
    return responseData.data.included.map((value, index) => {
        const { ordered_photo_ids, recipe_id, text_content } = value.attributes;
        return new RecipeFormSectionState (value.id, index, ordered_photo_ids, recipe_id, text_content);
    });
}

export function sortByAttributeNameOrId (data, validSortingFields, sortingFieldIndex, sortById) {
    // assummes response data passed in is on the lowest 'data' property
    // i.e., a successful Axios response: res.data.data

    let sortingFailure = false;

    //  [NOTE] Failure checks not yet implemented

    // will fail if sorting field doesn't exist inside object, etc.

    const fieldSort = (a, b) => {
        if(sortById === true) {
            return a.id === b.id ? 0 : (a.id < b.id ? -1 : 1);
        }
        else {
            const sortingField = validSortingFields[sortingFieldIndex];
            const propertyIsString = typeof(a.attributes[sortingField]) === 'string';

            const fieldA = propertyIsString === true 
                ? a.attributes[sortingField].toUpperCase()
                : a.attributes[sortingField];

            const fieldB = propertyIsString === true 
                ? b.attributes[sortingField].toUpperCase()
                : b.attributes[sortingField];

            return fieldA === fieldB ? 0 : (fieldA < fieldB ? -1 : 1);
        }
    }

    if(sortingFailure === true) {
        console.warn('Failed to sort properly. Data returned in original order');
        return data;
    }

    return data.sort(fieldSort);
}