function backendConstantsPhotoVersion (maxWidth, maxHeight) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
}

const BackendConstants = {
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
    },
    uploaders: {
        photo: {
            defaultVersion : new backendConstantsPhotoVersion(768, 768),
            versions: {
                'thumb': new backendConstantsPhotoVersion(128, 128),
                'small': new backendConstantsPhotoVersion(256, 256),
                'medium': new backendConstantsPhotoVersion(512, 512)
            },
            isValidVersionName: function(versionName){
                return (isValuelessFalsey(versionName) === false && this.versions.hasOwnProperty(versionName));
            },
            getUrlForVersion: function (photoFileProperty, versionName){
                if(!photoFileProperty) { return; }
                const validName = this.isValidVersionName(versionName) === true;
                return validName === true ? photoFileProperty[versionName]?.url : photoFileProperty.url;
            },
            getVersionData: function (versionName){
                const validName = this.isValidVersionName(versionName) === true;
                return validName === true ? this.versions[versionName] : this.defaultVersion;
            }
        },
        productPhoto: {
            defaultVersion : new backendConstantsPhotoVersion(768, 768),
            versions: {
                'thumb': new backendConstantsPhotoVersion(128, 128),
                'small': new backendConstantsPhotoVersion(256, 256),
                'medium': new backendConstantsPhotoVersion(512, 512)
            },
            isValidVersionName: function(versionName){
                return (isValuelessFalsey(versionName) === false && this.versions.hasOwnProperty(versionName));
            },
            getUrlForVersion: function (photoFileProperty, versionName){
                if(!photoFileProperty) { return; }
                const validName = this.isValidVersionName(versionName) === true;
                return validName === true ? photoFileProperty[versionName]?.url : photoFileProperty.url;
            },
            getVersionData: function (versionName){
                const validName = this.isValidVersionName(versionName) === true;
                return validName === true ? this.versions[versionName] : this.defaultVersion;
            }
        }
    }
}

export default BackendConstants