import React, { PropTypes } from 'react';
import ReactTable from 'react-table';

const ListSelect = React.createClass({
	getInitialState() {
		return {
			items: { results: [] }
		};
	},
	componentWillMount() {
		this.props.list.loadItems(
			{
				filters: this.props.filters || []
			},
			(err, items) => {
				if (err) throw new Error(err);
				this.setState({
					items
				});
			}
		);
	},
	render() {
		const { list } = this.props;
		const { items } = this.state;
		return (
			<div>
				<h4>Select an exisiting {list.singular}</h4>
				<ItemsTable
					columns={list.columns}
					items={items}
					onSelect={this.props.onSelect}
					list={list}
				/>
			</div>
		);
	}
});

const ItemsTable = React.createClass({
	onRowClick(state, rowInfo, column, instance) {
		return {
			onClick: e => {
				this.props.onSelect(rowInfo.original);
			}
		};
	},
	render() {
		const { items } = this.props;

		const columns = [
			// {
			// 	Header: 'ID',
			// 	accessor: 'id' // String-based value accessors!
			// },
			{
				Header: 'Name',
				accessor: 'name'
			}
		];

		return (
			<ReactTable
				data={items.results}
				columns={columns}
				getTrProps={this.onRowClick}
			/>
		);
	}
});

module.exports = ListSelect;
