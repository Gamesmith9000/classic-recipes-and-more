import React from 'react'

class ContentManagerHome extends React.Component {
    render() {
        return (
            <div className="content-manager-home">
                <p>[ContentManagerHome Component]</p>
                <p>{this.props.currentAdmin}</p>
            </div>
        )
    }
}

export default ContentManagerHome
