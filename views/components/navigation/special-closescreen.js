/**
 * @flow
 * Exports a button that closes the current overlay screen
 */

import React from 'react'
import {Text, Navigator, StyleSheet, Platform} from 'react-native'
import {Touchable} from '../touchable'
import noop from 'lodash/noop'
import type {RouteType} from '../../types'

export function CloseScreenButton(
  {route, navigator, buttonStyle}: {route: RouteType, navigator: Navigator, buttonStyle?: any}
) {
  return (
    <Touchable
      borderless
      highlight={false}
      style={[styles.button, buttonStyle]}
      onPress={route.onDismiss ? () => route.onDismiss(route, navigator) : noop}
    >
      <Text style={styles.text}>Close</Text>
    </Touchable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 10 : 16,
    paddingHorizontal: Platform.OS === 'ios' ? 18 : 16,
  },
  text: {
    fontSize: 17,
    color: 'white',
  },
})
