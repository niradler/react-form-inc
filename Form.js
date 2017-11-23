import React, {Component} from 'react';
import Input from './Input';
class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            formData: {},
            errors: {},
            validate: false,
            updateKey: Math.random()
        }
        this.stateClone = this.state;
        this.syncFormState = this
            .syncFormState
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }
    componentDidMount() {
        if (this.props.debug) {
            console.log('componentDidMount', this.props)
        }
    }
    syncFormState(name, value, err) {
        const state = this.stateClone;
        state.formData[name] = value;
        if (Object.getOwnPropertyNames(err).length !== 0) {
            state.errors = Object.assign(state.errors, err);

        } else {
            delete state.errors[name];
        }
        this.stateClone = state;
        if (this.props.debug) {
            console.log('syncFormState', state)
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const state = this.stateClone;
        const isErr = Object
            .getOwnPropertyNames(state.errors)
            .length;
        let isEmpty = false;
        for (const key in state.formData) {
            if (state.formData.hasOwnProperty(key) && state.formData[key].length === 0) {
                isEmpty = true;
                break;
            }
        }
        if (isEmpty || isErr) {
            state.isValid = false;
            state.validate = true;
        } else {
            state.validate = false;
            state.isValid = true;
        }

        if (state.isValid) {
            this.setState(state);
        }
        if (typeof(this.props.OnSubmit) === 'function') {
            this
                .props
                .OnSubmit(state);
        }

        if (this.props.debug) {
            console.log('handleSubmit', state)
        }
    }

    render() {
        const props = this.props;
        const btnDefault = {
            text: props.btn
                ? props.btn.text
                : "Submit",
            props: props.btn
                ? props.btn.props
                : {
                    type: "submit",
                    className: "btn btn-defualt"
                }
        }
        return React.createElement('form', Object.assign({
            onSubmit: this.handleSubmit
        }, props), props.fields.map((f) => {
            return React.createElement(Input, Object.assign(f, {
                syncFormState: this.syncFormState
            }, {
                key: Math.random()
            }), null)
        }), React.createElement('button', props.btn.props, props.btn.text))

    }
}

export default Form;