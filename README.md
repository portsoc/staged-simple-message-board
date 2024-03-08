# Simple Apps need APIs

In this repo we see how many APIs emerge _without_ planning.

## Stage 1: A basic structure

* `svr.js` is a four line express static server.
* `index.html` contains just static content.
* `index.js` is a simple client JS script that writes the the console on page load.

## Stage 2: Reading some data ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-2))

* `svr.js` adds an array of default messages and a route (at `/messages`) that returns them in response to a GET request.
* `index.html` just has the `messagelist` id added so we can refer to it in the script.
* `index.js` adds a `loadMessages` function that fetches messages from the server, replacing the initial static content.

## Stage 3: Storing data ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-3))

* `svr.js` adds a second route for `/messages`, this time defining what we do for POST requests – we add a new message.
* `index.html` includes two new input fields for entering a new message.
* `index.js` includes a new `sendMessage` function that posts the new message, and a `checkKeys` function that looks for ENTER being pressed so posting a new message is more usable.  The `loadMessages` function has been refactored to call smaller named functions.

## Stage 4: An API route for every message ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-4))

* `svr.js` now stores objects instead of strings, using UUIDs to identify messages; and adds a new route at `/messages/:id` for getting the details of any individual message.
* `index.html` includes a new `detail` field.
* `index.js` allows users to hover over messages to get information about the time the message was posted (this is retrieved for each message as the `mouseenter` event occurs).

## Stage 5: Refactoring as a module ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-5))

* `svr.js` has been simplified with all code that isn't specific to HTTP removed to a separate module.
* `messageboard.js` created which now contains all the core logic.

## Stage 6: An API route and client page for update messages ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-6))

* `svr.js` adds a second route at `/messages/:id` to allow PUT requests so a message can be edited, also adds `extensions` parameter to `express.static` to automatically fill in `.html` in URLs.
* `messageboard.js` adds a function for updating a message.
* `index.js` now adds an "(edit)" link to each message.
* `message.html` created to show an individual message.
* `message.js` created with the client-side script for sending an edited message to the server with a PUT request.

## Stage 7: Style! ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-7))

* `index.html` and `message.html` put the inputs in a `<header>` and add a link to the stylesheet
* `style.css` makes it all pretty, with dark and light mode

## Stage 8: Data belongs in a database ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-8))

* `svr.js` uses the `messageboard` module asynchronously
* `messageboard.js` uses SQLite instead of an in-memory array, using the `sqlite` package
* `migrations-sqlite/001-initial.sql` is the SQL script that creates the necessary table (used in `messageboard.js` by the `db.migrate()` call)
* `database.sqlite` is the database file (it gets created by `messageboard.js` when we first run the server)

## Stage 9: Single Page App ([see the diff](https://github.com/portsoc/staged-simple-message-board/commit/stage-9))

* `editable-message.js` is added.  This defines a custom HTML element that displays a message as well as a button to edit it.  When the `edit` button is clicked, the message becomes editable and new `Save` and `Cancel` buttons becoem available.  When `Save` is clicked, the element's `url` attribute is used to `PUT` the modified text on the server.
* `editable-message.html` is added.  This file contains HTML templates and CSS that will be used by the `&lt;editable-message&gt;` component.
* `svr.js` the message ID to be edited now comes from the URL
* `messageboard.js` uses the ID passed from `svr.js` as a parameter rather than extracting it from the payload.
* `index.html` has a new `script` element that includs the new `editable-message` component.  We also change the button text from `Send` to `Add` which is semantically closer to the new `Edit` and `Save` buttons. 
* `index.js` is modified to generate an `&lt;editable-message&gt;` element for each message, rather than the old anchor element.
* `message.html` and `message.js` are removed.


