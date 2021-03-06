import * as React from 'react'
import {StyleSheet, FlatList} from 'react-native'
import * as c from '@frogpond/colors'
import type {StoryType} from './types'
import {ListSeparator} from '@frogpond/lists'
import {NoticeView} from '@frogpond/notice'
import type {TopLevelViewPropsType} from '../types'
import {NewsRow} from './news-row'
import {openUrl} from '@frogpond/open-url'

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
	contentContainer: {
		flexGrow: 1,
	},
})

type Props = TopLevelViewPropsType & {
	name: string
	onRefresh: () => any
	entries: StoryType[]
	loading: boolean
	thumbnail: false | number
}

export class NewsList extends React.PureComponent<Props> {
	onPressNews = (url: string) => {
		return openUrl(url)
	}

	renderSeparator = () => (
		<ListSeparator
			spacing={{left: this.props.thumbnail === false ? undefined : 101}}
		/>
	)

	renderItem = ({item}: {item: StoryType}) => (
		<NewsRow
			onPress={this.onPressNews}
			story={item}
			thumbnail={this.props.thumbnail}
		/>
	)

	keyExtractor = (item: StoryType) => item.title

	render() {
		// remove all entries with blank excerpts
		// remove all entries with a <form from the list
		let entries = this.props.entries
			.filter((entry) => entry.excerpt.trim() !== '')
			.filter((entry) => !entry.content.includes('<form'))

		return (
			<FlatList
				ItemSeparatorComponent={this.renderSeparator}
				ListEmptyComponent={<NoticeView text="No news." />}
				contentContainerStyle={styles.contentContainer}
				data={entries}
				keyExtractor={this.keyExtractor}
				onRefresh={this.props.onRefresh}
				refreshing={this.props.loading}
				renderItem={this.renderItem}
				style={styles.listContainer}
			/>
		)
	}
}
