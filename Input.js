import React, {Component} from 'react';
const Validator = require('Validator')
class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isValid: true,
            rules: props.rules,
            errors: {},
            feedbackClass: '',
            name: this.props.props.name
                ? this.props.props.name
                : this.props.key
        };

        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleBlur = this
            .handleBlur
            .bind(this);
        this.handleValidation = this
            .handleValidation
            .bind(this);
        this.checkForErrors = this
            .checkForErrors
            .bind(this);

    }
    componentDidMount() {
        this.checkForErrors(this.state.name, this.state.value);
        if (typeof(this.props.syncFormState) === 'function') {
            this
                .props
                .syncFormState(this.state.name, this.state.value, this.state.errors)
        }
    }
    checkForErrors(name, value) {
        let v;
        /* Validator is an external tool and to get more details go to
     https://github.com/ratiw/Validator */
        const state = this.state;
        if (name) {
            v = Validator.make({
                [name]: value
            }, {[name]: this.state.rules})
        }
        if (v.fails()) {
            let errors = v.getErrors()
            state.isValid = false;
            state.errors = errors;

        }
        if (v.passes()) {
            state.errors = {};
            state.isValid = true;
        }
        return state;
    }
    //run validation against specific field or the entire form
    handleValidation(name, value) {

        const state = this.checkForErrors(name, value);
        if (state.isValid) {
            state.feedbackClass = this.props.successClass;
            state.isValid = true;
        } else {
            state.isValid = false;
            state.feedbackClass = this.props.errorClass;
        }

        this.setState(state);
        return state;
    }
    handleChange(e) {

        const name = this.state.name;
        const value = e.target.value;
        this.props.props.value = value;
        const state = this.handleValidation(name, value);
        state.value = value;

        if (typeof(this.props.onChange) === 'function') {
            this
                .props
                .onChange(e)
        }
        this.setState(state);
    }
    handleBlur(e) {
        if (typeof(this.props.onBlur) === 'function') {
            this
                .props
                .onBlur(e);
        }

        if (typeof(this.props.syncFormState) === 'function') {
            this
                .props
                .syncFormState(this.state.name, this.state.value, this.state.errors)
        }

    }
    //React.createElement('div', null, );
    render() {

        const divProps = {
            className: this.props.InputWrapClass + ' ' + this.state.feedbackClass
        };
        const labelProps = this.props.label.props;
        const inputProps = Object.assign(this.props.props, {
            value: this.props.props.value
                ? this.props.props.value
                : '',
            onChange: this.handleChange,
            onBlur: this.handleBlur,
            onSubmit: this.handleSubmit
        });
        if (this.props.help) {
            var helpProps = this.props.help.props;
            var helpTxt = this.props.help.text;
        }
        if (this.props.error) {
            var errorProps = this.props.error.props;
            var errTxt = this.props.error.text !== 'auto'
                ? this.props.error.text
                : this.state.errors[this.state.name]
        }

        return React.createElement('div', divProps, React.createElement('label', labelProps, this.props.label.text), React.createElement('input', inputProps, null), this.props.help
            ? React.createElement('span', helpProps, helpTxt)
            : null, !this.state.isValid
            ? React.createElement('span', errorProps, errTxt)
            : null);
    }
}

export default Input;