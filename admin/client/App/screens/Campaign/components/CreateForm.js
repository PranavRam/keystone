import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'object-assign';
import vkey from 'vkey';
import AlertMessages from '../../../shared/AlertMessages';
import { Fields } from 'FieldTypes';
import InvalidFieldType from '../../../shared/InvalidFieldType';
import { Button, Form, Modal } from '../../../elemental';
class CreateForm extends React.Component {
	constructor(props) {
		super(props);
		var values = {};
		Object.keys(this.props.list.fields).forEach(key => {
			var field = this.props.list.fields[key];
			var FieldComponent = Fields[field.type];
			// console.log(this.props.data, field.path, values)
			values[field.path] =
				(this.props.data && this.props.data[field.path]) ||
				FieldComponent.getDefaultValue(field);
		});

		this.state = {
			values: values,
			alerts: {}
		};
		this.handleChange = this.handleChange.bind(this);
		this.getFieldProps = this.getFieldProps.bind(this);
		this.setInputReadOnly = this.setInputReadOnly.bind(this);
		// Set the field values to their default values when first rendering the
		// form. (If they have a default value, that is)
	}
	componentDidMount() {
		document.body.addEventListener('keyup', this.handleKeyPress, false);
	}
	componentWillUnmount() {
		document.body.removeEventListener('keyup', this.handleKeyPress, false);
	}
	handleKeyPress = evt => {
		if (vkey[evt.keyCode] === '<escape>') {
			this.props.onCancel();
		}
	};
	// Handle input change events
	handleChange(event) {
		if (this.props.data && this.props.data[event.path]) return
		var values = assign({}, this.state.values);
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	}
	// Set the props of a field
	getFieldProps(field) {
		var props = assign({}, field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		// props.noedit = this.props.data && this.props.data[field.path];
		props.mode = 'create';
		props.key = field.path;
		return props;
	}
	// Create a new item when the form is submitted
	submitForm = event => {
		event.preventDefault();
		const createForm = event.target;
		const formData = new FormData(createForm);
		this.props.list.createItem(formData, (err, data) => {
			if (data) {
				if (this.props.onCreate) {
					this.props.onCreate(data);
				} else {
					// Clear form
					this.setState({
						values: {},
						alerts: {
							success: {
								success: 'Item created'
							}
						}
					});
				}
			} else {
				if (!err) {
					err = {
						error: 'connection error'
					};
				}
				// If we get a database error, show the database error message
				// instead of only saying "Database error"
				if (err.error === 'database error') {
					err.error = err.detail.errmsg;
				}
				this.setState({
					alerts: {
						error: err
					}
				});
			}
		});
	};
	setInputReadOnly(ref) {
		if (ref) {
			ReactDOM.findDOMNode(ref).style.pointerEvents = 'none';
		}
	}
	// Render the form itself
	render() {
		// if (!this.props.isOpen) return;
		var form = [];
		var list = this.props.list;
		var nameField = this.props.list.nameField;
		var focusWasSet;

		// If the name field is an initial one, we need to render a proper
		// input for it
		if (list.nameIsInitial) {
			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.autoFocus = focusWasSet = true;
			if (nameField.type === 'text') {
				nameFieldProps.className = 'item-name-field';
				nameFieldProps.placeholder = nameField.label;
				nameFieldProps.label = '';
			}

			const el = React.createElement(Fields[nameField.type], nameFieldProps);
			form.push(el);
		}

		// Render inputs for all initial fields
		Object.keys(list.initialFields).forEach(key => {
			var field = list.fields[list.initialFields[key]];
			// If there's something weird passed in as field type, render the
			// invalid field type component
			if (typeof Fields[field.type] !== 'function') {
				form.push(
					React.createElement(InvalidFieldType, {
						type: field.type,
						path: field.path,
						key: field.path
					})
				);
				return;
			}
			// Get the props for the input field
			var fieldProps = this.getFieldProps(field);
			// If there was no focusRef set previously, set the current field to
			// be the one to be focussed. Generally the first input field, if
			// there's an initial name field that takes precedence.
			if (!focusWasSet) {
				fieldProps.autoFocus = focusWasSet = true;
			}
			const ref =
				this.props.data && this.props.data[field.path]
					? this.setInputReadOnly
					: null;
			const el = React.createElement(Fields[field.type], {
				...fieldProps,
				ref: ref
			});
			form.push(el);
		});

		return (
			<Form layout="horizontal" onSubmit={this.submitForm}>
				<Modal.Header
					text={'Create a new ' + list.singular}
					// showCloseButton
				/>
				<Modal.Body>
					<AlertMessages alerts={this.state.alerts} />
					{form}
				</Modal.Body>
				<Modal.Footer>
					<Button color="success" type="submit" data-button-type="submit">
						Create
					</Button>
					{/* <Button
						variant="link"
						color="cancel"
						data-button-type="cancel"
						onClick={this.props.onCancel}
					>
						Cancel
					</Button> */}
				</Modal.Footer>
			</Form>
		);
	}
}

module.exports = CreateForm;
