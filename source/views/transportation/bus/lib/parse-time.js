// @flow

const TIME_FORMAT = 'h:mma'
import {timezone} from '@frogpond/constants'
import moment from 'moment-timezone'

export const parseTime = (now: moment) => (
	time: string | false,
): null | moment => {
	// either pass `false` through or return a parsed time
	if (time === false) {
		return null
	}

	// interpret in Central time
	let m = moment.tz(time, TIME_FORMAT, true, timezone())

	// and set the date to today
	m.dayOfYear(now.dayOfYear())

	return m
}
