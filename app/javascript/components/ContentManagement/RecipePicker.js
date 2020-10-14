import React from 'react'
import axios from 'axios'

class RecipePicker extends React.Component {
    constructor () {
        super();
        this.state = {
            recipeData: null,
            sortById: true
        }
    }

    // [NOTE] When changes are made to the database, data needs to be updated here
    //  This will need to work with the associated form

    handleSortingButtonPress = (event) => {
        event.preventDefault();
        this.setState({
            sortById: !this.state.sortById
        });
    }

    mapRecipePreviews = (recipeDataList) => {
        if(!recipeDataList) return;
        
        const sortedRecipeDataList = this.sortRecipeData(recipeDataList);
        const mappedRecipePreview = sortedRecipeDataList.map((item, index) => {
            return (
                <li className="recipe-preview" key={index}>
                    <div className="id-column">ID: {item.id}</div>
                    <div>Title: {item.attributes.title}</div>
                </li>
            );
        });
        // [NOTE] Consider changing li key to something other than index.

        return(
            <ul className="recipe-previews-list">
                {mappedRecipePreview}
            </ul>
        );
    }

    sortRecipeData = (recipeData) => {
        if(this.state.sortById === true) {
            return recipeData.sort(function(a,b) {
                const aId = parseInt(a.id);
                const bId = parseInt(b.id);
                
                if(aId === bId) {
                    return 0;
                }
                if(aId < bId) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
        else {
            return recipeData.sort(function(a,b) {
                const aName = a.attributes.title.toUpperCase();
                const bName = b.attributes.title.toUpperCase();
                
                if(aName === bName) {
                    return 0;
                }
                if(aName < bName) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
    }

    componentDidMount () {
        axios.get('/api/v1/recipes')
        .then(res => {
            this.setState({
                recipeData: res.data.data
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="recipe-picker">
                <div className="sorting-controls">
                    <div>Sorting By:</div>
                    <button onClick={this.handleSortingButtonPress}>
                        {this.state.sortById === true 
                        ?
                            "ID"
                        :
                            "Title"
                        }
                    </button>
                </div>
                {this.mapRecipePreviews(this.state.recipeData)}
            </div>
        )
    }
}

export default RecipePicker
