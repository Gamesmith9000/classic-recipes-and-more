import React from 'react'

class RecipeForm extends React.Component {
    constructor() {
        super();
        this.state = {
            ingredients: [''],
            paragraphs: [''],
            title: ''
        }
    }

    onAddParagraph = (event) => {
        event.preventDefault();
        let updatedParagraphsState = this.state.paragraphs;
        updatedParagraphsState.push('');
        this.setState({paragraphs: updatedParagraphsState});
    }

    onTitleInputChange = (event) => {
        this.setState({title: event.target.value});
    }

    render() {
        return (
            <form className="recipe-form">
                <h2>Create Recipe</h2>
                <label>
                    Title
                    <input type="text" onChange={this.onTitleInputChange}/>
                </label>
                <br />
                <label>
                    Paragraphs
                    <br />
                    <button onClick={this.onAddParagraph}>+</button>
                </label>
            </form>
        )
    }
}

export default RecipeForm
