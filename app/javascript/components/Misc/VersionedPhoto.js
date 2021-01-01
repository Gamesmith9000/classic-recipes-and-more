import React from 'react'
import BackendConstants from '../Utilities/BackendConstants'

export function VersionedPhoto (props) {
    const { renderNullWithoutUrl, targetClassName, textDisplayForNoPhoto, uploadedFileData, uploadedFileVersionName, uploaderNamePrefix } = props;

    // As an alternative, uploadedFileData prop can be passed the url string directly

    const noFileData = (!uploadedFileData);
    const uploaderData = BackendConstants.uploaders.safelyGetUploader(uploaderNamePrefix);
    const uploaderVersionData = uploaderData.getVersionData(uploadedFileVersionName);

    const noPhotoClass = noFileData === true ? ' no-photo' : '';
    const targetClass = targetClassName ? ' ' + targetClassName : '';
    const versionClass = BackendConstants.uploaders.photo.isValidVersionName(uploadedFileVersionName) ? ' ' + uploadedFileVersionName : '';

    const itemClassName = 'versioned-photo' + versionClass + noPhotoClass + targetClass;

    if(noFileData === true) {
        if(renderNullWithoutUrl === true) { return null; }
        return <div className={itemClassName}>{textDisplayForNoPhoto}</div>
    }
    else {
        const usingString = typeof(uploadedFileData) === 'string';
        const url = usingString === true ? uploadedFileData : uploaderData.getUrlForVersion(uploadedFileData, uploadedFileVersionName);
        if(renderNullWithoutUrl === true && !url) { return null; }
        return <img className={url ? itemClassName : itemClassName + ' no-photo'} src={url} />;
    }
}

export default VersionedPhoto