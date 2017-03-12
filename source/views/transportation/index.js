// @flow
/**
 * All About Olaf
 * Transportation page
 */

import React from 'react'

import {TabbedView, Tab} from '../components/tabbed-view'

import OtherModesView from './otherModes'
import BusView from './bus'

export default function TransportationPage() {
  return (
    <TabbedView>
      <Tab id="ExpressLineBusView" title="Express Bus" icon="bus">
        {() => <BusView line="Express Bus" />}
      </Tab>

      <Tab id="RedLineBusView" title="Red Line" icon="bus">
        {() => <BusView line="Red Line" />}
      </Tab>

      <Tab id="BlueLineBusView" title="Blue Line" icon="bus">
        {() => <BusView line="Blue Line" />}
      </Tab>

      <Tab
        id="TransportationOtherModesListView"
        title="Other Modes"
        icon="boat"
      >
        {() => <OtherModesView line="Other Modes" />}
      </Tab>
    </TabbedView>
  )
}
