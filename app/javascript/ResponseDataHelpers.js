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

export function mapSectionsDataFromAxiosResponse (responseData) {
    return responseData.data.included.map((value) => {
        let sectionData = value.attributes;
        sectionData.id = value.id;
        return sectionData;
    });
}
