import axios from 'axios'

export const BackendConstants = {
    /*  [NOTE] This object holds the hard coded references to certain rails values. This allows other
         JS objects to utilize the values, while only requiring updates in a single location            */

    models: {
        recipe: {
            defaults: {
                featured: false
            },
            validations: {
                description: {
                    maximum: 300,
                    minimum: 5
                },
                title: {
                    maximum: 40,
                    minimum: 2
                }
            }
        },
        photo: {
            defaults: {
                tag: 'DEFAULT'
            },
            validations: {
                tag: {
                    maximum: 40,
                    minimum: 1
                },
                title: {
                    maximum: 25,
                    minimum: 2
                }
            }
        }
    }
}

export function arraysHaveMatchingValues (array1, array2) {
    if(array1.length !== array2.length) {
        return false;
    }
    return array1.every((element, index) => element === array2[index]);
}

export function bumpArrayElement (array, index, direction) {
    if(direction !== -1 && direction !== 1) {
        return array;
    }
    
    let start = array.slice(0, index);
    let end = array.slice(index, array.length);
    const item = end.shift();

    if(direction === -1) {
        const poppedItem = start.pop();
        return start.concat(item).concat(poppedItem).concat(end);
    }
    else {
        const shiftedItem = end.shift();
        return start.concat(shiftedItem).concat(item).concat(end);
    }
}

export function getSortableFieldsFromResponseData (resData, ignoredPropertiesList = []) {
    const topProperties = Object.getOwnPropertyNames(resData);
    let properties = [];
    let propertiesWithNested = [];

    for(let i = 0; i < topProperties.length; i++) {
        if(!ignoredPropertiesList?.includes(topProperties[i])) {
            // if item has nested properties, add to propertiesWithNested

            // otherwise, just add to properties array
        }
    }

    // steps: 
    //
    //  (1) Iterate through top level properties,
    //      putting objects with and without nested 
    //      properties in seperate arrays
    //  (2) Iterate through the array for objects
    //      with children doing the same actions as
    //      in step (1). Keep iterating until the 
    //      aforementioned array is empty

/*
    while(fieldsWithNested.length > 1) {
        // iterated 
    }
*/
}

export function isNonNullNonArrayObject (targetObject) {
    if(!targetObject || Array.isArray(targetObject)) { return false; }
    return (typeof(targetObject) === 'object');
}

export function mapSectionsDataFromAxiosResponse (responseData) {
    return responseData.data.included.map((value) => {
        let sectionData = value.attributes;
        sectionData.id = value.id;
        return sectionData;
    });
}

export function setAxiosCsrfToken () {
    const csrfToken = document.querySelector('meta[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}


export function validationErrorsToString (fieldDisplayName, fieldErrorArray) {
    return fieldDisplayName + " " + fieldErrorArray.join (' and ')
}
