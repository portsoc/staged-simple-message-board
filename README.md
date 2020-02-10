# Simple Apps need APIs

In this repo we see how many APIs emerge _without_ planning.

## Stage 1: A basic structure

* `svr.js` is a four line express static server.
* `index.html` contains just static content.
* `script.js` writes the the console on page load.

## Stage 2: Reading some data

* `svr.js` adds an array of default messages and a route (at `/messages`) that returns them in response to a GET request.
* `index.html` just has the `messagelist` id added so we can refer to it in the script.
* `script.js` adds a `loadMessages` function that fetches messages from the server, replacing the initial static content.

## Stage 3: Storing data

* `svr.js` adds a second route for `/messages`, this time defining what we do for POST requests – we add a new message.
* `index.html` includes two new input fields for entering a new message.
* `script.js` includes a new `sendMessage` function that POSTS the new message, and a `checkKeys` function that looks for ENTER being pressed so posting a new message is more usable.  The `loadMessages` function has been refactored to call smaller named functions.

## Stage 4: An API route for every message

* `svr.js` now stores objects instead of strings, using UUIDs to identify messages; and adds a new route for GETting the details of any individual message.
* `index.html` includes a new `detail` field.
* `script.js` allows users to hover over messages to get information about the time the message was posted (this is retrieved for each message as the `mouseenter` event occurs).

## Stage 5: Refactoring as a module

* `svr.js` has been simplified with all code that isn't specific to HTTP removed to a separate module.
* `messageboard.js` created which now contains all the core logic.

## Exercise


Imagine a database with tables for lecturers and students, in which every student has a personal tutor who is a lecturer.

1. Who might want to use data from such a database? _(List potential users)_
2. Consider each type of user that wants to access the data: what functionality will they want from the web app? _(List use cases)_
3. Design a (read-only) API that provides the data necessary to fulfil the requirements identified above:
   * Identify the routes
   * Specify what the server would do in response to a GET request
   * Describe when the client web app will use the request
   * NB: You don't have to use any syntax here, you're just dealing with concepts.

When done with the above, extend the exercise:

4. Add a table of modules: every student currently studies several modules, and every module is currently taught by one or more lecturers. Repeat steps 1–3.
5. Consider that we need to remember the modules students took in previous years; so a final-year student can have 11 modules they studied before, and 5 they are studying currently. Repeat steps 1–3.
6. Consider who would want to update any of the data. Repeat steps 1–3 but this time design a read-write API: beside the GET routes you defined above, you can define PUT, POST, and DELETE routes.
