/**
 * The form that's visible when "Create <ItemName>" is clicked on either the
 * List screen or the Item screen
 */

import React from 'react';

import { Modal, Button } from '../../../elemental';
import CreateForm from './CreateForm';
import StepZilla from 'react-stepzilla';
import { connect } from 'react-redux';
import ListSelect from './ListSelect';

const CreateStepper = React.createClass({
	displayName: 'CreateStepper',
	propTypes: {
		err: React.PropTypes.object,
		isOpen: React.PropTypes.bool,
		list: React.PropTypes.object,
		onCancel: React.PropTypes.func,
		onCreate: React.PropTypes.func
	},
	getInitialState() {
		return {
			step: 0,
			wizardData: {
				'ad-clients': {},
				'ad-client-contacts': {},
				ads: {}
			}
		};
	},
	getDefaultProps() {
		return {
			err: null,
			isOpen: false
		};
	},

	onCreate(step, data) {
		switch (step) {
			case 0:
				return this.setState(prevState => {
					return {
						...prevState,
						wizardData: {
							...prevState.wizardData,
							'ad-clients': data
						},
						step: 1
					};
				});
			case 1:
				return this.setState(prevState => {
					return {
						...prevState,
						wizardData: {
							...prevState.wizardData,
							'ad-client-contacts': data
						},
						step: 2
					};
				});
			case 2:
				return this.setState(prevState => {
					return {
						...prevState,
						wizardData: {
							...prevState.wizardData,
							ads: data
						},
						step: 3
					};
				});
			case 3:
				return this.setState(prevState => {
					return {
						...prevState,
						step: 4
					};
				});
			case 4:
				return this.props.onCreate(data);
			default:
				return;
		}
	},

	onClose() {
		this.setState(this.getInitialState());
		this.props.onCancel();
	},
	render() {
		const { step, wizardData } = this.state;
		// console.log(this.state);
		class Step extends React.Component {
			isValidated = () => {
				return true;
			};
			componentWillReceiveProps(nextProps) {
				// console.log(nextProps)
				if (nextProps.currentStep === nextProps.step) {
					this.props.list.loadItems({ filters: [] }, (err, data) => {
						// console.log(err, data);
					});
				}
			}

			onCreate = data => {
				this.props.onCreate(this.props.step, data);
				this.props.jumpToStep(this.props.step + 1);
			};

			render() {
				const {
					list,
					currentStep,
					step,
					data,
					hideList,
					filters = [],
					allowSkip
				} = this.props;
				return (
					<div>
						{currentStep === step && (
							<div>
								<CreateForm data={data} onCreate={this.onCreate} list={list} />
								{!hideList && (
									<ListSelect
										list={list}
										onSelect={this.onCreate}
										filters={filters}
									/>
								)}
								{allowSkip && (
									<Button
										color="primary"
										onClick={this.onCreate}
									>
										Skip
									</Button>
								)}
							</div>
						)}
					</div>
				);
			}
		}
		const steps = [
			{
				name: 'Client',
				component: (
					<Step
						onCreate={this.onCreate}
						currentStep={step}
						step={0}
						list={this.props.lists['ad-clients']}
					/>
				)
			},
			{
				name: 'Client Contact',
				component: (
					<Step
						onCreate={this.onCreate}
						data={{ company: wizardData['ad-clients'].id }}
						filters={[
							{
								field: { path: 'company' },
								value: {
									inverted: false,
									value: [wizardData['ad-clients'].id]
								}
							}
						]}
						currentStep={step}
						step={1}
						list={this.props.lists['ad-client-contacts']}
					/>
				)
			},
			{
				name: 'Ad',
				component: (
					<Step
						data={{ client: wizardData['ad-clients'].id }}
						onCreate={this.onCreate}
						currentStep={step}
						filters={[
							{
								field: { path: 'client' },
								value: {
									inverted: false,
									value: [wizardData['ad-clients'].id]
								}
							}
						]}
						step={2}
						list={this.props.lists['ads']}
					/>
				)
			},
			{
				name: 'Content',
				component: (
					<Step
						data={{ ad: wizardData['ads'].id }}
						onCreate={this.onCreate}
						currentStep={step}
						step={3}
						list={this.props.lists['contents']}
						hideList
						allowSkip
					/>
				)
			},
			{
				name: 'Campaign',
				component: (
					<Step
						data={{
							adClient: wizardData['ad-clients'].id,
							adClientContact: wizardData['ad-client-contacts'].id,
							ads: [wizardData['ads'].id]
						}}
						onCreate={this.onCreate}
						currentStep={step}
						step={4}
						list={this.props.lists['campaigns']}
						hideList
					/>
				)
			}
		];
		return (
			<Modal.Dialog
				isOpen={this.props.isOpen}
				onClose={this.onClose}
				backdropClosesModal
			>
				<Modal.Header showCloseButton />
				{/* {this.renderForm()} */}
				<StepZilla
					steps={steps}
					stepsNavigation={false}
					showNavigation={false}
					onStepChange={step => this.setState({ step })}
				/>
			</Modal.Dialog>
		);
	}
});

module.exports = connect(state => {
	return {
		lists: state.lists.data
	};
})(CreateStepper);
