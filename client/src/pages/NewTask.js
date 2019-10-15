import React from 'react';
import { Route } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
export default class NewTask extends React.Component {
    render() {
        return (
        <Route path='/newTask'>
                <h1>New Labeller</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            Music input
                        </Form.Label>
                    </Form.Group>
                <input type="file" id="filepicker" name="fileList" webkitdirectory="" directory="" multiple onChange={(event) => console.log(event)} />
                </Form>
        </Route>
        );
    }
}