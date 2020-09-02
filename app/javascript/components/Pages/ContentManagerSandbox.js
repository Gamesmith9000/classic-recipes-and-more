import React from 'react'
import axios from 'axios'

class ContentManagerSandbox extends React.Component {
    constructor() {
        super();
        this.imageFileInput = React.createRef();
        this.titleInput = React.createRef();
        this.notesInput = React.createRef();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.imageFileInput.current.files[0]);
        console.log(this.titleInput.current.value);
        console.log(this.notesInput.current.value);

        const csrfToken = document.querySelector('meta[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        axios.post('api/v1/photos', {
            file: this.imageFileInput.current.files[0],
            title: this.titleInput.current.value,
            notes: this.notesInput.current.value
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="content-manager-sandbox">
                <p>[ContentManagerSandbox Component]</p>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Image uploader example
                        <input type="file" ref={this.imageFileInput} />
                    </label>
                    <label>
                        Title
                        <input type="text" ref={this.titleInput} />
                    </label>
                    <label>
                        Notes
                        <input type="text" ref={this.notesInput} />
                    </label>
                    <br/>
                    <button type="submit">Upload</button>
                </form>
            </div>
        )
    }
}

// [NOTE] there is currently no production build. Authentication is not yet implemented for this reason.

export default ContentManagerSandbox
