/**
 * @flow
 *
 * Building Hours "report a problem" screen.
 */

import * as React from 'react'
import {ScrollView, View} from 'react-native'
import moment from 'moment-timezone'
import {InfoHeader} from '@frogpond/info-header'
import {
	TableView,
	Section,
	Cell,
	CellTextField,
	CellToggle,
	DeleteButtonCell,
	ButtonCell,
} from '@frogpond/tableview'
import type {
	BuildingType,
	NamedBuildingScheduleType,
	SingleBuildingScheduleType,
} from '../types'
import type {TopLevelViewPropsType} from '../../types'
import {summarizeDays, formatBuildingTimes, blankSchedule} from '../lib'
import {submitReport} from './submit'

type Props = TopLevelViewPropsType & {
	navigation: {state: {params: {initialBuilding: BuildingType}}}
}

type State = {
	building: BuildingType
}

export class BuildingHoursProblemReportView extends React.PureComponent<
	Props,
	State
> {
	static navigationOptions = {
		title: 'Report a Problem',
	}

	state = {
		building: this.props.navigation.state.params.initialBuilding,
	}

	openEditor = (
		scheduleIdx: number,
		setIdx: number,
		set?: SingleBuildingScheduleType = undefined,
	) => {
		this.props.navigation.navigate('BuildingHoursScheduleEditorView', {
			initialSet: set,
			onEditSet: (editedData: SingleBuildingScheduleType) =>
				this.editHoursRow(scheduleIdx, setIdx, editedData),
			onDeleteSet: () => this.deleteHoursRow(scheduleIdx, setIdx),
		})
	}

	editSchedule = (idx: number, newSchedule: NamedBuildingScheduleType) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]
			schedules.splice(idx, 1, newSchedule)

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	deleteSchedule = (idx: number) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]
			schedules.splice(idx, 1)

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	addSchedule = () => {
		this.setState((state) => {
			return {
				...state,
				building: {
					...state.building,
					schedule: [
						...state.building.schedule,
						{
							title: 'Hours',
							hours: [blankSchedule()],
						},
					],
				},
			}
		})
	}

	addHoursRow = (idx: number) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]

			schedules[idx] = {
				...schedules[idx],
				hours: [...schedules[idx].hours, blankSchedule()],
			}

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	editHoursRow = (
		scheduleIdx: number,
		setIdx: number,
		newData: SingleBuildingScheduleType,
	) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]

			let hours = [...schedules[scheduleIdx].hours]
			hours.splice(setIdx, 1, newData)

			schedules[scheduleIdx] = {...schedules[scheduleIdx], hours}

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	deleteHoursRow = (scheduleIdx: number, setIdx: number) => {
		this.setState((state) => {
			let schedules = [...state.building.schedule]

			let hours = [...schedules[scheduleIdx].hours]
			hours.splice(setIdx, 1)

			schedules[scheduleIdx] = {...schedules[scheduleIdx], hours}

			return {
				...state,
				building: {
					...state.building,
					schedule: schedules,
				},
			}
		})
	}

	submit = () => {
		console.log(JSON.stringify(this.state.building))
		submitReport(
			this.props.navigation.state.params.initialBuilding,
			this.state.building,
		)
	}

	render() {
		let {schedule: schedules = []} = this.state.building

		return (
			<ScrollView>
				<InfoHeader
					message="If you could tell us what the new times are, we&rsquo;d greatly appreciate it."
					title="Thanks for spotting a problem!"
				/>

				<TableView>
					{schedules.map((s, i) => (
						<EditableSchedule
							key={i}
							addRow={this.addHoursRow}
							editRow={this.openEditor}
							onDelete={this.deleteSchedule}
							onEditSchedule={this.editSchedule}
							schedule={s}
							scheduleIndex={i}
						/>
					))}

					<Section>
						<Cell
							accessory="DisclosureIndicator"
							onPress={this.addSchedule}
							title="Add New Schedule"
						/>
					</Section>

					<Section footer="Thanks for reporting!">
						<ButtonCell onPress={this.submit} title="Submit Report" />
					</Section>
				</TableView>
			</ScrollView>
		)
	}
}

type EditableScheduleProps = {
	schedule: NamedBuildingScheduleType
	scheduleIndex: number
	addRow: (idx: number) => any
	editRow: (
		schedIdx: number,
		setIdx: number,
		set: SingleBuildingScheduleType,
	) => any
	onEditSchedule: (idx: number, set: NamedBuildingScheduleType) => any
	onDelete: (idx: number) => any
}

class EditableSchedule extends React.PureComponent<EditableScheduleProps> {
	onEdit = (data) => {
		let idx = this.props.scheduleIndex
		this.props.onEditSchedule(idx, {
			...this.props.schedule,
			...data,
		})
	}

	editTitle = (newValue: string) => {
		this.onEdit({title: newValue})
	}

	editNotes = (newValue: string) => {
		this.onEdit({notes: newValue})
	}

	toggleChapel = (newValue: boolean) => {
		this.onEdit({closedForChapelTime: newValue})
	}

	addHoursRow = () => {
		this.props.addRow(this.props.scheduleIndex)
	}

	delete = () => {
		this.props.onDelete(this.props.scheduleIndex)
	}

	openEditor = (setIndex: number, hoursSet: SingleBuildingScheduleType) => {
		this.props.editRow(this.props.scheduleIndex, setIndex, hoursSet)
	}

	render() {
		let {schedule} = this.props
		let now = moment()

		return (
			<View>
				<Section header="INFORMATION">
					<TitleCell onChange={this.editTitle} text={schedule.title || ''} />
					<NotesCell onChange={this.editNotes} text={schedule.notes || ''} />

					<CellToggle
						label="Closes for Chapel"
						onChange={this.toggleChapel}
						value={Boolean(schedule.closedForChapelTime)}
					/>

					{schedule.hours.map((set, i) => (
						<TimesCell
							key={i}
							now={now}
							onPress={this.openEditor}
							set={set}
							setIndex={i}
						/>
					))}

					<Cell
						accessory="DisclosureIndicator"
						onPress={this.addHoursRow}
						title="Add More Hours"
					/>

					<DeleteButtonCell onPress={this.delete} title="Delete Schedule" />
				</Section>
			</View>
		)
	}
}

type TextFieldProps = {text: string; onChange: (string) => any}
// "Title" will become a textfield like the login form
const TitleCell = ({text, onChange = () => {}}: TextFieldProps) => (
	<CellTextField
		autoCapitalize="words"
		onChangeText={onChange}
		onSubmitEditing={onChange}
		placeholder="Title"
		returnKeyType="done"
		value={text}
	/>
)

// "Notes" will become a big textarea
const NotesCell = ({text, onChange}: TextFieldProps) => (
	<CellTextField
		autoCapitalize="sentences"
		onChangeText={onChange}
		onSubmitEditing={onChange}
		placeholder="Notes"
		returnKeyType="done"
		value={text}
	/>
)

type TimesCellProps = {
	set: SingleBuildingScheduleType
	setIndex: number
	onPress: (setIdx: number, set: SingleBuildingScheduleType) => any
	now: moment
}

class TimesCell extends React.PureComponent<TimesCellProps> {
	onPress = () => {
		this.props.onPress(this.props.setIndex, this.props.set)
	}

	render() {
		let {set, now} = this.props

		return (
			<Cell
				accessory="DisclosureIndicator"
				cellStyle="RightDetail"
				detail={formatBuildingTimes(set, now)}
				onPress={this.onPress}
				title={set.days.length ? summarizeDays(set.days) : 'Days'}
			/>
		)
	}
}
