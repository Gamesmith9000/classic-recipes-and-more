import React from 'react'
import axios from 'axios'

class ContentManagerSandbox extends React.Component {
    render() {
        return (
            <div className="content-manager-sandbox">
                <p>[ContentManagerSandbox Component]</p>
            </div>
        )
    }
}

// Note: there is currently no production build. Authentication is not yet implemented for this reason.

export default ContentManagerSandbox
