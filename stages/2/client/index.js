/* Remove all contents from a given element */
function removeContentFrom(what) {
  what.textContent = '';
}

/* Add an array of messages to the page */
function showMessages(messages, where) {
  for (const message of messages) {
    const li = document.createElement('li');
    li.textContent = message;
    where.append(li);
  }
}

async function loadMessages() {
  const response = await fetch('messages');
  let messages;
  if (response.ok) {
    messages = await response.json();
  } else {
    messages = ['failed to load messages :-('];
  }

  const messagelist = document.querySelector('#messagelist');
  removeContentFrom(messagelist);
  showMessages(messages, messagelist);
}

function pageLoaded() {
  loadMessages();
}

pageLoaded();