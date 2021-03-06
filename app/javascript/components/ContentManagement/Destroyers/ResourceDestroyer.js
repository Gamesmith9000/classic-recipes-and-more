import React, { Fragment } from 'react'
import axios from 'axios'
import { capitalCase, paramCase, snakeCase } from 'change-case'
import { setAxiosCsrfToken } from '../../Utilities/Helpers'

class ResourceDestroyer extends React.Component {
    constructor () {
        super();
        this.state = { itemData: null }
    }

    handleDestroyButtonInput = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        const { itemName, selectedItemId } = this.props;
        const deleteUrl = `/api/v1/${snakeCase(itemName + 's')}`;

        axios.delete(`${deleteUrl}/${selectedItemId}.json`)
        .then(res => {
            window.alert(`${capitalCase(itemName)} deleted (ID:${selectedItemId})`)
            this.props.onClose();
        })
        .catch(err => console.log(err));
    }

    componentDidMount () {
        const { itemName, selectedItemId } = this.props;
        const showUrl = `/api/v1/${snakeCase(itemName + 's')}`;

        axios.get(`${showUrl}/${selectedItemId}.json`)
        .then(res => this.setState({ itemData: res.data.data }))
        .catch(err => console.log(err));
    }

    renderDestroyerUi () {
        const { destroyerUiComponent, onClose, selectedItemId } = this.props;
        if(!destroyerUiComponent) { return null; }

        const destroyerUiProps = {
            itemData: this.state.itemData,
            key: selectedItemId,
            onClose: () => onClose(true),
            onDestroyButtonPress: this.handleDestroyButtonInput,
        };

        return destroyerUiComponent(destroyerUiProps);
    }

    render() { 
        const { itemName } = this.props;
        const destroyerClassName = `${paramCase(itemName)}-destroyer`;

        return (
            <div className={destroyerClassName}>
                {this.state.itemData &&
                    <Fragment>
                        {this.renderDestroyerUi()}
                    </Fragment>
                }
            </div>
        )
    }
}

export default ResourceDestroyer
