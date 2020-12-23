import React from 'react'
import axios from 'axios'

class ProductManager extends React.Component {
    constructor () {
        super();
        // this.state = ({});
    }

    componentDidMount () {
        axios.get('api/v1/products.json')
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err))
    }

    render() {     
        return (
            <div className="shop-manager">
            </div>
        )
    }
}

export default ProductManager
