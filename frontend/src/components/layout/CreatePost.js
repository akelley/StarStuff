import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostDataService from "../../services/post.service";
import { createMessage } from '../../actions/messages';
import '../css/common/Common.css';
import '../css/layout/CreatePost.css';

const defaultState = {
  non_field_errors: [],
  title: '',
  image_url: '',
  text: '',
  postCreated: false
}

class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      non_field_errors: [],
      title: '',
      image_url: '',
      text: '',
      postCreated: false
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, image_url, text } = this.state;
    let data = { title: title, image_url: image_url, text: text, user: this.props.user };

    await PostDataService.create(data)
      .then(response => {
        this.setState({ 
          non_field_errors: [],
          title: '',
          image_url: '',
          text: '',
          postCreated: true
         });
        this.props.createMessage({ postCreatedSuccess: 'You have successfully posted to the blog.'});
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (!this.props.isAuthenticated || this.state.postCreated) {
      return <Redirect to="/blog" />;
    }
    
    return (
      <div className="container create-post-container">
        <form onSubmit={this.handleSubmit}>
          <div className={"modal-body mx-3 " + (this.state.non_field_errors ? 'mb-2' : 'my-5')}> 
            <h3>Create Post</h3><hr />

            { this.state.non_field_errors && 
              <div className="ml-5 mb-4">
                <ul className="non_field_error_list">
                  { this.state.non_field_errors.map((error, index) =>
                    <li key={index} className="help-block"><em>{ error }</em></li>
                  )}
                </ul>
              </div>
            }
            
            <div className="md-form mb-3">
              <label htmlFor="title">Title:
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Title" 
                  className="form-control validate input" 
                  onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
                  value={this.state.title}
                  required
                />
              </label>
            </div>

            <div className="md-form mt-2 mb-3">
              <label htmlFor="image_url">Image URL:
                <input 
                  type="text" 
                  name="image_url" 
                  placeholder="Image URL" 
                  className="form-control validate input" 
                  onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
                  value={this.state.image_url}
                />
              </label>
            </div>

            <div className="md-form mt-2 mb-3">
              <label htmlFor="text">Text:
                <textarea 
                  type="text" 
                  name="text" 
                  placeholder="Text" 
                  rows={10}
                  className="form-control validate input" 
                  onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
                  value={this.state.text}
                  required
                />
              </label>
            </div>
    
            <div className="create-post-footer">
              <button type="submit" className="btn btn-large btn-primary create-post-button">Create Post</button>
              <a href="/blog" className="btn btn-large btn-secondary create-post-button">Cancel</a>
            </div>
          </div>
        </form>
      </div>
    )
  };
}

CreatePost.propTypes = {
  error: PropTypes.object.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  error: state.errors,
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { createMessage })(CreatePost);
