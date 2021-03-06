import * as React from 'react'
import type {OtherModeType} from '../types'
import {ListRow, Detail, Title} from '@frogpond/lists'
import {Column, Row} from '@frogpond/layout'

type Props = {
	onPress: (OtherModeType) => any
	mode: OtherModeType
}

export class OtherModesRow extends React.PureComponent<Props> {
	_onPress = () => this.props.onPress(this.props.mode)

	render() {
		let {mode} = this.props

		return (
			<ListRow arrowPosition="top" onPress={this._onPress}>
				<Row alignItems="center">
					<Column flex={1}>
						<Title lines={1}>{mode.name}</Title>
						<Detail lines={1}>{mode.synopsis}</Detail>
					</Column>
				</Row>
			</ListRow>
		)
	}
}
