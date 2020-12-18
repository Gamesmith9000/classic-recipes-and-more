import axios from 'axios'
import React, { Fragment } from 'react'
import { setAxiosCsrfToken } from '../../Utilities/Helpers'


class RecipeDestroyer extends React.Component {
    constructor () {
        super();
        this.state = {
            recipeData: null,
        }
    }

    handleDestroyRecipeButtonInput = (event) => {
        event.preventDefault();
        setAxiosCsrfToken();

        axios.delete(`/api/v1/recipes/${this.props.recipeId}.json`)
        .then(res => {
            window.alert(`Recipe deleted (ID:${this.props.recipeId})`)
            this.props.handleClose();
        })
        .catch(err => console.log(err));
    }

    componentDidMount () {
        axios.get(`/api/v1/recipes/${this.props.recipeId}.json`)
        .then(res => {
            this.setState({
                recipeData: res.data.data
            })
        })
        .catch(err => console.log(err));
    }

    render() { 
        return (
            <div className="recipe-destroyer">
                {this.state.recipeData &&
                    <Fragment>
                        <h3>You are about to delete a recipe:</h3>
                        <p>ID: {this.props.recipeId}</p>
                        <p>Title: {this.state.recipeData.attributes.title}</p>
                        <p>Description: {this.state.recipeData.attributes.description}</p>
                        <button onClick={this.handleDestroyRecipeButtonInput}>
                            Delete
                        </button>
                        <button onClick={this.props.handleClose}>
                            Cancel
                        </button>
                    </Fragment>
                }
            </div>
        )
    }
}

export default RecipeDestroyer
