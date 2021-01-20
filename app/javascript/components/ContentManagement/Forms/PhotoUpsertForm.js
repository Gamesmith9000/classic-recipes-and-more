import axios from 'axios'
import { capitalCase, paramCase } from 'change-case'
import React from 'react'
import VersionedPhoto from '../../Misc/VersionedPhoto'
import { UnsavedChangesDisplay, ValidationErrorDisplay } from '../../Utilities/ComponentHelpers'
import BackendConstants from '../../Utilities/BackendConstants'
import { setAxiosCsrfToken } from '../../Utilities/Helpers'

class PhotoUpsertForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            null
        )
    }
}

export default PhotoUpsertForm
