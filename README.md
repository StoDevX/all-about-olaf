# AAO-React-Native

[![Windows build status](https://ci.appveyor.com/api/projects/status/qi83hnivu0rkgbvo?svg=true)](https://ci.appveyor.com/project/hawkrives/aao-react-native)
[![macOS build status](https://travis-ci.org/StoDevX/AAO-React-Native.svg?branch=master)](https://travis-ci.org/StoDevX/AAO-React-Native)

## About
The St. Olaf community, now in pocket size… rewritten in React Native.

## Getting Started
- Clone the repository
- `cd` into the folder
- Install React Native: http://facebook.github.io/react-native/docs/getting-started.html#content
- `npm install`
- `npm run ios`

## Note
The Calendar might nag you for a Google Calendar API key. You can either ask someone involved with this project for a key, or you may [create one yourself](https://console.developers.google.com/projectselector/apis/credentials) for use during development.

1. Create a copy of the `.env.sample.js` file and rename it to `.env.js`
2. Insert your API key in place of the `key goes here` text

## Completed
* Cage Menu
* Calendar
* Campus Dictionary
* Directory
* Home Page
* Important Contacts
* News
* Oleville
* SIS
* Settings
* Stav Menu
* Transportation

## Work-In-Progress
* Building Hours
* Campus Map
* Push Notifications
* Streaming Media

## Todo (modules)
See the [issues](https://github.com/StoDevX/AAO-React-Native/issues) for the current todo module items, or improvements that could be made to the existing modules.

## Todo (other)
* [3D touch actions](https://github.com/jordanbyron/react-native-quick-actions) for icon and within
* [Touch-ID](https://github.com/naoufal/react-native-touch-id) for SIS

## Contributing
Would you like to contribute? Great! Have a look at [React Native](http://facebook.github.io/react-native/docs/getting-started.html) and make a pull request! PRs are required, so fork away and make one! If you feel like you should have write access to the repo, please make an issue and we can discuss it.

We use two continuous-integration (CI) systems to make sure that the project still works as we change things. Any submissions you make will be validated by [Travis](https://travis-ci.org/StoDevX/AAO-React-Native/builds) and [AppVeyor](https://ci.appveyor.com/project/hawkrives/aao-react-native/history), the CIs.

Before you commit and push, make sure to lint your changes and fix any errors or warnings that `npm run lint` shows. We try to keep the `master` branch clean of all messages from eslint.
