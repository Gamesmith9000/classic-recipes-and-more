import React, { Fragment } from 'react'
import axios from 'axios'
import { setAxiosCsrfToken } from '../../Helpers'


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

        axios.delete(`/api/v1/recipes/${this.props.recipeId}`)
        .then(res => {
            this.props.handleClose();
        })
        .catch(err => console.log(err));
    }

    componentDidMount () {
        axios.get(`/api/v1/recipes/${this.props.recipeId}`)
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
                        <p>ID:&nbsp;{this.state.recipeData.id}</p>
                        <p>Title:&nbsp;{this.state.recipeData.attributes.title}</p>
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
