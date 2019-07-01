[![Netlify Status](https://api.netlify.com/api/v1/badges/763bcdc2-2cca-4491-b3af-ddf39aaaa1fc/deploy-status)](https://app.netlify.com/sites/game-tournament/deploys)

### RUN

* If you're developing the frontend using mock DB, you will find further instructions in [front README](https://github.com/esandez93/tekken3-scytl-tournament/blob/master/front/README.md).

* If you want to do local deploy of all the components, follow this instructions:
  - First of all, you have to execute an `npm install` in the root, the `front` and the `back` folders.
  - You need to install MongoDB
  - Run MongoDB. In the root's `package.json` is a script pointing to a route. That route must be your local MongoDB server.
  - Run API server. In the `back` folder execute `npm start`.
  - Run Frontend. In the `front` folder execute `npm start`.

* If you just want to work with one of the components and let the other be the one in PROD, just change the URL of the API in the frontend (/src/api/config.js)

### PUBLISH

In a common workflow, every push or PR to master will trigger the CI of Netlify for the frontend and Heroku's for the backend, so you will only have to wait a couple of minutes until it's finished.

This is only needed if the common packages are modified.

  - First of all, you need to instal `lerna` globally using `npm install --global lerna`.
  - You will have to commit and push the changes to the git repo.
  - Then you can use `lerna-publish` if you have access to the npmjs organization and publish the changes there.


### GENERAL TODOs
  - Assign real points on matches
  - Style and position nicely the World and Game selectors
  - User profile config view (Merge Settings with Profile menu points ?)
  - Error management on both BE and FE
  - Review login and logout FE logic on invalid token (check User field in localStorage)
  - Do some sketch of the Home view (d3.js ?)
  - Notification (and permission?) on match created with your user (email, app ...?)
  - Check Matches view on wide screens (>1980px ?)
  - Admin views:
    - Create worlds
    - Create games
    - Assign games to worlds
    - Assign worlds to users
