import React from 'react'
import BackendConstants from '../Utilities/BackendConstants'

export function VersionedPhoto (props) {
    const { additionalStyles, renderNullWithoutUrl, targetClassName, textDisplayForNoPhoto, uploadedFileData, uploadedFileVersionName, uploaderNamePrefix } = props;

    // As an alternative, uploadedFileData prop can be passed the url string directly

    const noFileData = (!uploadedFileData);
    const uploaderData = BackendConstants.uploaders.safelyGetUploader(uploaderNamePrefix);
    const uploaderVersionData = uploaderData.getVersionData(uploadedFileVersionName);

    const mainStyles = {
        height: uploaderVersionData.maxHeight,
        width: uploaderVersionData.maxWidth,
    }
    if(noFileData === false) { mainStyles.objectFit = "contain" }

    let additionalProps = { style: { ...mainStyles, ...additionalStyles } };
    if(targetClassName) { additionalProps.className = targetClassName; }

    if(noFileData === true) {
        if(renderNullWithoutUrl === true) { return null; }
        return <div {...additionalProps}>{textDisplayForNoPhoto}</div>
    }
    else {
        const usingString = typeof(uploadedFileData) === 'string';
        const url = usingString === true ? uploadedFileData : uploaderData.getUrlForVersion(uploadedFileData, uploadedFileVersionName);
        if(renderNullWithoutUrl === true && !url) { return null; }
        return <img src={url} {...additionalProps} />;
    }
}

export default VersionedPhoto