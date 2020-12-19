import axios from 'axios'

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

export function existsInLocalStorage (keyName) {
    const storedValue = localStorage.getItem(keyName);
    return isValuelessFalsey(storedValue) === false;
}

export function isValuelessFalsey (value, nanIsValidValue = false) {
    if(value === null || value === undefined) { return true; }
    if(Number.isNaN(value) && nanIsValidValue === true) { return true; }    
    return false;
}

export function isNonNullNonArrayObject (targetObject) {
    if(!targetObject || Array.isArray(targetObject)) { return false; }
    return (typeof(targetObject) === 'object');
}

export function objectsHaveMatchingValues (obj1, obj2) {
    const obj1IsValuelessFalsey = isValuelessFalsey(obj1);
    const obj2IsValuelessFalsey = isValuelessFalsey(obj2);
    
    if(obj1IsValuelessFalsey === true || obj2IsValuelessFalsey === true) {
        if(obj1IsValuelessFalsey === true && obj2IsValuelessFalsey === true) {
            return (obj1 === obj2);
        }
        else { return false; }
    }

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
