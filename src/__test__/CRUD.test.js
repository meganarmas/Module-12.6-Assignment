import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import FetchApi from '../component/FetchApi'

jest.mock('axios');

describe("FetchApi Component", () => {

    test('fetches and displays posts', async () => {
        const mockResponse = { data: [{ id: 1, title: "Testing A Post", body: "This is a test post!" }] };
        axios.get.mockResolvedValue(mockResponse);

        render(<FetchApi />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts');
            expect(screen.getByText("Testing A Post")).toBeInTheDocument();
            expect(screen.getByText("This is a test post!")).toBeInTheDocument();
        });
    });

    test('create a new post', async () => {
        const mockPost = { id: 2, title: "New Post", body: "This is a test to make a new post. Yay!" };
        axios.post.mockResolvedValue({ data: mockPost });

        const { getByLabelText, getByText, findByText } = render(<FetchApi />);

        fireEvent.change(getByLabelText(/Title:/i), { target: { value: "New Post" } });
        fireEvent.change(getByLabelText(/Body:/i), { target: { value: "This is a test to make a new post. Yay!" } });
        fireEvent.click(getByText(/Add Post/i));

        await findByText("New Post");

        expect(axios.post).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', { title: "New Post", body: "This is a test to make a new post. Yay!" });
        expect(screen.getByText("New Post")).toBeInTheDocument();
        expect(screen.getByText("This is a test to make a new post. Yay!")).toBeInTheDocument();
    });

    test('edits a post', async () => {
        const initialPosts = [{ id: 1, title: "Pre-edited Post", body: "This is the post before it was edited." }];
        const updatedPosts = [{ id: 1, title: "Edited Post", body: "This is the updated post!" }];

    axios.get.mockResolvedValue({ data: initialPosts });
    axios.put.mockResolvedValue({ data: updatedPosts });

    render(<FetchApi />);

    await waitFor(() => expect(screen.getByText("Pre-edited Post")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByLabelText("Post Title:"), { target: { value: "Edited Post" } });
    fireEvent.change(screen.getByLabelText("Body:"), { target: { value: "This is the updated post!" } });
    fireEvent.click(screen.getByText("Update Post"));

    await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1', { title: "Edited Post", body: "This is the updated post!" });
        expect(screen.getByText("Pre-edited Post")).toBeInTheDocument();
        expect(screen.getByText("This is the updated post!")).toBeInTheDocument();
    });
});

    test('delete a post', async () => {
        const initialPosts = [{ id: 1, title: "Post to Delete", body: "This post will be deleted." }];
        axios.get.mockResolvedValue({ data: initialPosts });
        axios.delete.mockResolvedValue({});

        render(<FetchApi />);

        await waitFor(() => expect(screen.getByText("Post to Delete")).toBeInTheDocument());

        const deleteButtons = await screen.findAllByText("Delete");
        console.log(deleteButtons)
        expect(deleteButtons.length).toBeGreaterThan(0);

        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1');
            expect(screen.queryByText("Post to Delete")).not.toBeInTheDocument();
        });
    });
});
