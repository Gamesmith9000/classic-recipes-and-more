function getProperDataFromWithinResponse (res) {
    // Find the location of the proper model data from Axios response, utilizing fast_jsonapi's formatting
    // Requires at least one item in response

    let targetData;
    let invalidResData = !res ? true : false;
    
    if(res[0]?.hasOwnProperty('attributes') && invalidResData === false) {
        // has res[0].attributes
        targetData = res[0];
    }
    else if(res.hasOwnProperty('data') && invalidResData === false) {
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
        console.warn("The response data's format is invalid.");
        return null;
    }

    return targetData;
}

export function getSortablePropertyNamesFromAttributes (res, includeIdProperty = true, ignoredPropertiesList = []) {
    const targetData = getProperDataFromWithinResponse(res);

    if(!targetData) {
        console.error('Response data has an invalid format. Cannot proceed.');
        return null;
    }
    
    const topProperties = Object.getOwnPropertyNames(targetData);

    let properties = includeIdProperty === true ? ['id'] : [];
    let propertiesWithNested = [];

    console.warn('Function incomplete');
    return;

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
    /*
        response object
        {
            data: {
                data: {
                    [0]: {
                        attributes: {

                        },
                        id: ___,
                        relationships: {

                        }

                    }
                }
            }
        }

    */

}

export function mapSectionsData (responseData) {
    return responseData.data.included.map((value) => {
        let sectionData = value.attributes;
        sectionData.id = value.id;
        return sectionData;
    });
}
