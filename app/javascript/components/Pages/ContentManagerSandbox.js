import React from 'react'
import axios from 'axios'

class ContentManagerSandbox extends React.Component {
    constructor() {
        super();
        this.captionInput = React.createRef();
        this.imageFileInput = React.createRef();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.imageFileInput.current.files[0]);
        console.log(this.captionInput.current.value);

        const csrfToken = document.querySelector('meta[name=csrf-token]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        axios.post( 'api/v1/photos', {
            file: this.imageFileInput.current.files[0],
            caption: this.captionInput.current.value
        })
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="content-manager-sandbox">
                <p>[ContentManagerSandbox Component]</p>
                <form onSubmit={this.handleSubmit}>m 
                    <label>
                        Image uploader example
                        <input type="file" ref={this.imageFileInput} />
                    </label>
                    <label>
                        Caption
                        <input type="text" ref={this.captionInput} />
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
