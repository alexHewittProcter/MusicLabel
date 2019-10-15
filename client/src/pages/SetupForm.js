import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class SetupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name:''};
        this.enterName = this.enterName.bind(this);
        this.completeForm = this.completeForm.bind(this);
    }
    render() {
        return (
            <div>
                <div className='pb-2 mt-4 mb-2 border-bottom'>
                    <h1>Setup form</h1>
                </div>
            <Form className='text-left'>
                <Form.Label>Name : </Form.Label>
                <Form.Control type='text' placeholder='Enter name.' value={this.state.name} onChange={this.enterName}/>
                <Button variant='success' size='lg' block='true' onClick={this.completeForm}>
                    Go
                </Button>
            </Form>
            </div>
        );
    }
    enterName(event) {
        this.setState({name:event.target.value});
    }

    completeForm() {
        this.props.mainApp.updateSettings({name:this.state.name});
    }
}