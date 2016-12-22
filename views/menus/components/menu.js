// @flow
import React from 'react'
import {StyleSheet, View, ListView, Text} from 'react-native'
import {FoodItemRow} from './food-item-row'
import DietaryFilters from '../../../data/dietary-filters'
import * as c from '../../components/colors'
import {Separator} from '../../components/separator'
import type {MenuItemType, ProcessedMenuPropsType} from '../types'
import {Cell} from 'react-native-tableview-simple'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    minHeight: 52,
    paddingRight: 10,
    paddingLeft: 20,
  },
  separator: {
    marginLeft: 20,
  },
  sectionHeader: {
    backgroundColor: c.iosListSectionHeader,
    paddingVertical: 5,
    paddingLeft: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  },
  sectionHeaderText: {
    color: 'black',
    fontWeight: 'bold',
  },
})

export class MenuListView extends React.Component {
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
  }

  componentWillMount() {
    this.load(this.props.data)
  }

  componentWillReceiveProps(newProps: {data: ProcessedMenuPropsType}) {
    this.load(newProps.data)
  }

  load(data: ProcessedMenuPropsType) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
    })
  }

  props: {
    data: ProcessedMenuPropsType,
  };

  renderSectionHeader(sectionData: any, sectionId: string) {
    return (
      <View style={styles.sectionHeader} key={sectionId}>
        <Text style={styles.sectionHeaderText}>
          {sectionId}
        </Text>
        {/*I'm reasonably sure that sectionData is an Array<MenuItemType>…*/}
        {sectionData.note ? <Text style={{color: c.iosDisabledText}}>({sectionData.note})</Text> : null}
      </View>
    )
  }

  renderFoodItem(rowData: MenuItemType, sectionId: string, rowId: string) {
    return (
      <FoodItemRow
        key={`${sectionId}-${rowId}`}
        data={rowData}
        filters={DietaryFilters}
        style={styles.row}
      />
    )
  }

  render() {
    if (!this.state.dataSource.getRowCount()) {
      return (
        <View style={styles.container}>
          <Cell title='No items to show. Try changing the filters.' />
        </View>
      )
    }

    return (
      <ListView
        style={styles.container}
        pageSize={3}
        removeClippedSubviews={false}
        // we have to disable this here and do it manually, because
        // there appears to be a bug where the ListView fails to
        // auto-calculate when the data is loaded after the listview mounts
        automaticallyAdjustContentInsets={false}
        contentInset={{bottom: 49}}
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={this.renderFoodItem}
        renderSeparator={(sectionId, rowId) =>
          <Separator key={`${sectionId}-${rowId}`} style={styles.separator} />}
        renderSectionHeader={this.renderSectionHeader}
      />
    )
  }
}
