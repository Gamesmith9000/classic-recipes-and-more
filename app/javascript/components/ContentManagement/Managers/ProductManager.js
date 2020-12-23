import React from 'react'
import axios from 'axios'
import Picker from '../Pickers/Picker'

class ProductManager extends React.Component {
    constructor () {
        super();
        // this.state = ({});
    }

    render() {     
        return (
            <div className="product-manager">
                <Picker itemName="product" />
            </div>
        )
    }
}

export default ProductManager
