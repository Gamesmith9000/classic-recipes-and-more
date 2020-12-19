import React from 'react'
import { BackendConstants } from '../Utilities/Helpers'

export function VersionedPhoto (props) {
    const { additionalStyles, photoFileData, photoVersionName, renderNullWithoutUrl, targetClassName, textDisplayForNoPhoto } = props;

    // As an alternative, photoFileData prop can be passed the url string directly

    const noFileData = (!photoFileData);
    const uploaderVersionData = BackendConstants.photoUploader.getVersionData(photoVersionName);

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
        const usingString = typeof(photoFileData) === 'string';
        const url = usingString === true ? photoFileData : BackendConstants.photoUploader.getUrlForVersion(photoFileData, photoVersionName);
        if(renderNullWithoutUrl === true && !url) { return null; }
        return <img src={url} {...additionalProps} />;
    }
}

export default VersionedPhoto