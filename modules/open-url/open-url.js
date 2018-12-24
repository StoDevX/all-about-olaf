// @flow

import {Platform, Linking} from 'react-native'

import {trackUrl, trackException} from '@frogpond/analytics'
import SafariView from 'react-native-safari-view'
import {CustomTabs} from 'react-native-custom-tabs'

function genericOpen(url: string) {
	return Linking.canOpenURL(url)
		.then(isSupported => {
			if (!isSupported) {
				console.warn('cannot handle', url)
			}
			return Linking.openURL(url)
		})
		.catch(err => {
			trackException(err.message)
			console.error(err)
		})
}

function iosOpen(url: string) {
	// SafariView.isAvailable throws if it's not available
	return SafariView.isAvailable()
		.then(() => SafariView.show({url}))
		.catch(() => genericOpen(url))
}

function androidOpen(url: string) {
	return CustomTabs.openURL(url, {
		showPageTitle: true,
		enableUrlBarHiding: true,
		enableDefaultShare: true,
	}).catch(() => genericOpen(url)) // fall back to opening in Chrome / Browser / platform default
}

export function openUrl(url: string) {
	const protocol = /^(.*?):/u.exec(url)

	if (protocol && protocol.length) {
		switch (protocol[1]) {
			case 'tel':
				return genericOpen(url)
			case 'mailto':
				return genericOpen(url)
			default:
				break
		}
	}

	switch (Platform.OS) {
		case 'android':
			return androidOpen(url)
		case 'ios':
			return iosOpen(url)
		default:
			return genericOpen(url)
	}
}

export function trackedOpenUrl({url, id}: {url: string, id?: string}) {
	trackUrl(id || url)
	return openUrl(url)
}

export function canOpenUrl(url: string) {
	// iOS navigates to about:blank when you provide raw HTML to a webview.
	// Android navigates to data:text/html;$stuff (that is, the document you passed) instead.
	if (/^(?:about|data):/u.test(url)) {
		return false
	}
	return true
}

export function openUrlInBrowser({url, id}: {url: string, id?: string}) {
	trackUrl(id || url)
	return genericOpen(url)
}
