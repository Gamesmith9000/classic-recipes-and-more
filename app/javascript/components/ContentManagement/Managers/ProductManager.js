import React from 'react'
import Picker from '../Pickers/Picker'

class ProductManager extends React.Component {
    constructor () {
        super();
        this.state = ({
            // destroyerIsOpen: false,
            // productFormIsOpen: false, // 
            // pickerIsOpen: true,
            selectedItemId: null
        });
    }

    changeSelectedItemId = (newId) => {
        this.setState({ selectedItemId: isNaN(newId) === true ? null : newId }); 
    }

    // Note: Making a modular managar would involve moving the 

    render() {  
        return (
            <div className="product-manager">
                NOTE: This temporarily passes in values like it's for recipes
                <Picker 
                    // itemName="product" 

                    itemName="recipe" 
                    mappedItemPreviewComponent={this.props.mappedItemPreviewComponent}
                    nonSortByFields={['ingredients', 'preview_photo_id']}
                    onSelectedItemIdChange={this.changeSelectedItemId}
                    key="product"
                    selectedItemId={this.state.selectedItemId}

                    // missing items from original RecipePicker:
                    //      handleDeleteRecipeButtonInput
                    //      handleModifyRecipeButtonInput
                    //
                />
            </div>
        )
    }
}

export default ProductManager
