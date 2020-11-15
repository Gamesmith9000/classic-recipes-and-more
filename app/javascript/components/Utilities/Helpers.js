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
        },

        photoUploader: {
            versions: ['large', 'medium', 'small', 'thumb']
        }
    }
}

export function arraysHaveMatchingValues (array1, array2) {
    console.log('WARNING: This method is being phased out. Call objectsHaveMatchingValues instead.');
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

export function isValuelessFalsey (value) {
    if(value === null || value === undefined || Number.isNaN(value) === true) {
        return true;
    }
    else { return false; }
}

export function isNonNullNonArrayObject (targetObject) {
    if(!targetObject || Array.isArray(targetObject)) { return false; }
    return (typeof(targetObject) === 'object');
}

export function objectsHaveMatchingValues (obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if(obj1Keys.length != obj2Keys.length) { return false; }

    for(let i = 0; i < obj1Keys.length; i++) {
        const key = obj1Keys[i];
        if(key !== obj2Keys[i]) { return false; }

        const value1 = obj1[key];
        const value2 = obj2[key];
        
        const value1IsObject = (typeof(value1) === 'object');
        const value2IsObject = (typeof(value2) === 'object'); 
    
        if(value1IsObject !== value2IsObject) { return false; }
        if(value1IsObject === true) {
            if(objectsHaveMatchingValues(value1, value2) === false) { return false; }
        }
        else /* if(value1IsObject === false) */ {
            if(value1 !== value2) { return false; }
        }
    }

    return true;
}

export function setAxiosCsrfToken () {
    const csrfToken = document.querySelector('meta[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

export function validationErrorsToString (fieldDisplayName, fieldErrorArray) {
    return fieldDisplayName + " " + fieldErrorArray.join (' and ')
}
