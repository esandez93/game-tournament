### TODOs
- Match creation:
    * Set wins and losses by character (Stepper ?) [VERY IMPORTANT]
    * Allow remove selected character
    * Tooltip with character info
    * Cancel creation and dismiss changes (with alert)
    * Save match
    * Implement draw result
    * Leave comments on matches
    * Error checking:
        + At least 1 character each user
        + One team with every character dead

- General TODO:
    * RESPONSIVE [VERY VERY VERY VERY VERY IMPORTANT]
    * User creation
    * Profile management (info and settings)
    * User list

- Unassigned:
    * Metrics [VERY IMPORTANT]
    * Chat ?
    * Duels
    * Events
    * Tournament organization
    * Game creation (to allow this to work with other games)
    * Notifications ?
        + Ranking position lost (configure by position)
        + Message received
        + Message posted on own match or another match you commented on
        + Match created


### Goals

Have a CRA project with the common features and examples used in lots of projects

### Features
- Code splitting \[[react-loadable](https://github.com/jamiebuilds/react-loadable)\]
- PWA Ready \[[react-app-rewired](https://github.com/timarney/react-app-rewired)\] \[[react-app-rewire-workbox](react-app-rewire-workbox)\]
- Hot reload \[[react-hot-loader](https://github.com/gaearon/react-hot-loader)\]
- Routing \[[react-router-dom](https://github.com/ReactTraining/react-router)\]
- Sass \[[node-sass](https://github.com/sass/node-sass)\]
- Styled components \[[styled-components](https://github.com/styled-components/styled-components)\]
- Props checking \[[prop-types](https://github.com/facebook/prop-types)\]
- Translations \[[i18next](https://github.com/i18next/i18next)\] \[[react-i18next](https://github.com/i18next/react-i18next)\]
- Custom theming
- Bundle size analysis \[[source-map-explorer](https://github.com/danvk/source-map-explorer)\]
- Testing:
    - Jest \[[jest](https://github.com/facebook/jest)\]
    - Enzyme \[[enzyme](https://github.com/airbnb/enzyme)\] \[[enzyme-adapter-react-16](https://www.npmjs.com/package/enzyme-adapter-react-16)\] \[[enzyme-to-json](https://github.com/adriantoine/enzyme-to-json)\]
- React context used for:
    - Theming
    - Login
    - Locale
    - Network
- \[[Storybook](https://github.com/storybooks/storybook)\] implementation with some addons:
    - Actions \[[@storybook/addon-actions](https://github.com/storybooks/storybook/tree/next/addons/actions)\]
    - Links \[[@storybook/addon-links](https://github.com/storybooks/storybook/tree/next/addons/links)\]
    - Knobs (+ smart knobs) \[[@storybook/addon-knobs](https://github.com/storybooks/storybook/tree/next/addons/knobs)\] \[[storybook-addon-smart-knobs](https://github.com/storybooks/addon-smart-knobs)\]
    - Console \[[@storybook/addon-console](https://github.com/storybooks/storybook-addon-console)\]
    - Info \[[@storybook/addon-info](https://github.com/storybooks/storybook/tree/next/addons/info)\]
    - Storysource \[[@storybook/addon-storysource](https://github.com/storybooks/storybook/tree/next/addons/storysource)\]
    - A11y (accessibility) \[[@storybook/addon-a11y](https://github.com/storybooks/storybook/tree/next/addons/a11y)\]
