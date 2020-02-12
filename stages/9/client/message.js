const el = {};

function showMessage(message) {
  el.message.value = message.msg;
}

function updateSendButton(message = 'Update') {
  el.send.value = message;
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
  if (e.target === el.message) {
    // change button to show message can be updated
    updateSendButton();
    if (e.key === 'Enter') {
      sendMessage();
    }
  }
}

/** Use fetch to put a JSON message to the server */
async function sendMessage() {
  const id = getMessageId();
  const payload = { id, msg: el.message.value };
  console.log('Payload', payload);

  updateSendButton('Sending');

  const response = await fetch(`messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    el.message.value = '';
    const updatedMessages = await response.json();
    showMessage(updatedMessages, el.messagelist);
    updateSendButton('Updated');
  } else {
    console.log('failed to send message', response);
    updateSendButton('Error');
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

window.addEventListener('load', pageLoaded);
