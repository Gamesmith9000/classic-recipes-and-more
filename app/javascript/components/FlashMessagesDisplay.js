import React, { Fragment } from 'react'

class FlashMessagesDisplay extends React.Component {
    render() {
        return (
            <Fragment>
                {flashMessages.alert &&
                    <p className="flash-alert">{flashMessages.alert}</p>
                }
                {flashMessages.notice &&
                    <p className="flash-notice">{flashMessages.notice}</p>
                }
            </Fragment>
        )
    }
}

export default FlashMessagesDisplay
