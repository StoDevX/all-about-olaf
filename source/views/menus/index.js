// @flow

import * as React from 'react'
import {TabNavigator, TabBarIcon} from '@frogpond/navigation-tabs'
import {isDevMode} from '@frogpond/constants'

import {BonAppHostedMenu} from './menu-bonapp'
import {GitHubHostedMenu} from './menu-github'
import {CarletonCafeIndex} from './carleton-menus'
import {BonAppPickerView} from './dev-bonapp-picker'

export {
	CarletonBurtonMenuScreen,
	CarletonLDCMenuScreen,
	CarletonWeitzMenuScreen,
	CarletonSaylesMenuScreen,
} from './carleton-menus'

export const MenusView = TabNavigator({
	StavHallMenuView: {
		screen: ({navigation}) => (
			<BonAppHostedMenu
				cafe="stav-hall"
				loadingMessage={[
					'Hunting Ferndale Turkey…',
					'Tracking wild vegan burgers…',
					'"Cooking" some lutefisk…',
					'Finding more mugs…',
					'Waiting for omelets…',
					'Putting out more cookies…',
				]}
				name="Stav Hall"
				navigation={navigation}
			/>
		),
		defaultNavigationOptions: {
			tabBarLabel: 'Stav Hall',
			tabBarIcon: TabBarIcon('nutrition'),
		},
	},

	TheCageMenuView: {
		screen: ({navigation}) => (
			<BonAppHostedMenu
				cafe="the-cage"
				ignoreProvidedMenus={true}
				loadingMessage={[
					'Checking for vegan cookies…',
					'Serving up some shakes…',
					'Waiting for menu screens to change…',
					'Frying chicken…',
					'Brewing coffee…',
				]}
				name="The Cage"
				navigation={navigation}
			/>
		),
		defaultNavigationOptions: {
			tabBarLabel: 'The Cage',
			tabBarIcon: TabBarIcon('cafe'),
		},
	},

	ThePauseMenuView: {
		screen: ({navigation}) => (
			<GitHubHostedMenu
				loadingMessage={[
					'Mixing up a shake…',
					'Spinning up pizzas…',
					'Turning up the music…',
					'Putting ice cream on the cookies…',
					'Fixing the oven…',
				]}
				name="The Pause"
				navigation={navigation}
			/>
		),
		defaultNavigationOptions: {
			tabBarLabel: 'The Pause',
			tabBarIcon: TabBarIcon('paw'),
		},
	},

	CarletonMenuListView: {
		screen: CarletonCafeIndex,
		defaultNavigationOptions: {
			tabBarLabel: 'Carleton',
			tabBarIcon: TabBarIcon('menu'),
		},
	},

	...(isDevMode() ? {BonAppDevToolView: {screen: BonAppPickerView}} : {}),
})
MenusView.navigationOptions = {
	title: 'Menus',
}
