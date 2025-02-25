const el = {};

function showMessage(message) {
  el.message.value = message.msg;
}

function getMessageId() {
  return window.location.hash.substring(1);
}

async function loadMessage() {
  const id = getMessageId();
  const response = await fetch(`messages/${id}`);
  let message;
  if (response.ok) {
    message = await response.json();
  } else {
    message = { msg: 'failed to load messages :-(' };
  }
  showMessage(message);
}

/* add a message if enter pressed,
   update button to make it "update" when the message is edited */
function checkKeys(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

/** Use fetch to put a JSON message to the server */
async function sendMessage() {
  const id = getMessageId();
  const payload = { id, msg: el.message.value };
  console.log('Payload', payload);

  const response = await fetch(`messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    el.message.value = '';
    const updatedMessages = await response.json();
    showMessage(updatedMessages, el.messagelist);
  } else {
    console.log('failed to send message', response);
  }
}

/**
 * Page elements used in the program are
 * setup here for convenience.
 */
function prepareHandles() {
  el.message = document.querySelector('#message');
  el.send = document.querySelector('#send');
}

/**
 * Connect listeners for button clicks,
 * keyboard input, etc.
 */
function addEventListeners() {
  el.send.addEventListener('click', sendMessage);
  el.message.addEventListener('keyup', checkKeys);
}

function pageLoaded() {
  prepareHandles();
  addEventListeners();
  loadMessage();
}

// deprecated in favour of using defer in the script tag
// window.addEventListener('load', pageLoaded);
pageLoaded();
