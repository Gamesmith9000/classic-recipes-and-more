import axios from 'axios'

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

function getUrlForPhotoVersion (photoId, standardUrl, versionNameText) {
    // [NOTE] This relies on the uploader containing the format '/id/filename'
    const separator =  String(photoId).concat("/");
    const splitUrl = standardUrl.split(separator);
    return splitUrl[0].concat(separator, versionNameText, "_", splitUrl[1]);
}

export function getUrlForPhotoVersionLarge (photoId, standardUrl) {
    return getUrlForPhotoVersion(photoId, standardUrl, "large")
}

export function getUrlForPhotoVersionMedium (photoId, standardUrl) {
    return getUrlForPhotoVersion(photoId, standardUrl, "medium")
}

export function getUrlForPhotoVersionSmall (photoId, standardUrl) {
    return getUrlForPhotoVersion(photoId, standardUrl, "small")
}

export function getUrlForPhotoVersionThumb (photoId, standardUrl) {
    return getUrlForPhotoVersion(photoId, standardUrl, "thumb")
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

export function validationErrorsToString (fieldName, fieldErrorArray) {
    return fieldName + " " + fieldErrorArray.join (' and ')
}
