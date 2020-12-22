import React from 'react'
import { existsInLocalStorage } from '../Utilities/Helpers';

class Shop extends React.Component {
    constructor() {
        super();
        this.state = {
            cartItems: [],
            componentHasMounted: false
        }
    }

    updateCartInLocalStorage = (cartItemsState) => {
        localStorage.setItem('cartItems', JSON.stringify(cartItemsState));
    }

    componentDidMount() {
        if(existsInLocalStorage('cartItems', false) === true) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems'));
            this.setState({ cartItems });
        }
        paypal.Buttons().render('#paypal-button-container');
    }

    render() {
        const exampleCartValue = [ { count: 3, itemId: 0 }, { count: 1, itemId: 2 }, { count: 101, itemId: 500 } ];
        
        return (
            <div className="shop">
                <h1>Shop</h1>
                <div id="paypal-button-container" />
                <p>localStorage - Cart options:</p>
                <button onClick={() => this.updateCartInLocalStorage(exampleCartValue)}>
                    Save example to...
                </button>
                <button onClick={() => this.updateCartInLocalStorage("")}>
                    Clear string in...
                </button>
                <button onClick={() => this.updateCartInLocalStorage([])}>
                    Save empty array to...
                </button>
            </div>
        )
    }
}

export default Shop
