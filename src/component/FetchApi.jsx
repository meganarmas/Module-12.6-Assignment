import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form } from 'react-bootstrap';

const FetchApi = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({title: '', body: ''});
    const [editPost, setEditPost] = useState(null);

    const fetchPost = async () => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error)
        }
    };

    const addPost = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
            setPosts([... posts, response.data]);
            setNewPost({title: '', body: ''});
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const updatePost = async (e) => {
        e.preventDefault();
        if (!editPost) return; 

        try {
            const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${editPost.id}`, newPost);
            setPosts(posts.map(post => post.id === editPost.id ? response.data : post));
            setEditPost(2); // should clear the editing state
            setNewPost({title: '', body: ''});
        } catch (error) {
            console.error('Error updating post:', error)
        }
    };

    const deletePost = async (id) => {
        try {
            const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error)
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    return(
        <div>
            <h2>Posts</h2>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                        <button onClick={() => setEditPost(post)}>Edit</button>
                        <button onClick={() => deletePost(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>{editPost ? "Edit Post" : "Create Post"}</h2>
            <form onSubmit={editPost ? updatePost : addPost}>
                <div>
                <label htmlFor='title'>Post Title:</label>
                <input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({... newPost, title: e.target.value})}
                required
                />
                </div>

                <div>
                <label htmlFor="body">Body:</label>
                <textarea
                id="body"
                value={newPost.body}
                onChange={(e) => setNewPost({... newPost, body: e.target.value})}
                required
                />
                </div>
                <button type="submit">{editPost ? "Update Post" : "Add Post"}</button>
            </form>
        </div>
    );
};

export default FetchApi;