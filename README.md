# Simple Apps need APIs 
In this repo we see how many APIs emerge _without_ planning.

## Stage 1: A basic structure
 * 'svr.js' is a four line express static server.
 * 'index.html' contains just static content.
 * 'script.js' writes the the console on page load.

## Stage 2: Reading some data
 * 'svr.js' add an array of default messages and a route (called '/messages') that returns them if a GET request is received.
 * 'index.html' just has the messagelist id added so we can refer to it in the JS.
 * 'script.js' add a loadmessage function that fetches messages from the new route, replaces the initial static content.

## Stage 3: Storing data
 * 'svr.js' add a second route for '/messages', this time defining what we do for POST requests.
 * 'index.html' includes two new input fields.
 * 'script.js' includes new sendMessage function that POSTS new messages, and checkKeys function that looks for ENTER being pressed.  The loadMessages function has been refactored to call smaller named functions.

## Stage 4: 
 * 'svr.js' started storing objects instead of strings; usig uuids to identify messages and added a new route for single messages if their detail is required.
 * 'index.html' includes a new details field.
 * 'script.js' allows users to hover over messages to get information about the time the message was posted (this is retrieved for each message as the mouseenter event occurs).

# Exercise:

Imagine a database with tables for lecturers and students, in which every student has a personal tutor who is a lecturer.  We wish to create a web-based service that uses this table.
1. Who might its users be?
2. Consider each type of user that you have identified: what will they want the web client to do?
3. Design a (read-only) API that provides the data necessary to fulfil the requirements identified above
  * NB: You don't have to get the syntax perfect - you're just dealing with concepts here - to do 'a' the client will need to get 'b' and 'c'
4. Are there any design attributes that fall out of your initial API design?
  * For example: to get 'b' and 'c' the server will have to know 'd' and do 'e'.
