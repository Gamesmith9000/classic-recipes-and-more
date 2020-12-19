import React from 'react'

class Shop extends React.Component {
    componentDidMount() {
        paypal.Buttons().render('#paypal-button-container');
    }

    render() {
        return (
            <div className="shop">
                <p>[Shop Component]</p>
                <div id="paypal-button-container" />
            </div>
        )
    }
}

export default Shop
