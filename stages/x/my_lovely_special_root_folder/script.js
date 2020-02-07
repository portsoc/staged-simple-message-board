async function getSomeMessages() {

  const headers = await fetch("messages");
  
  if (headers.ok) {
    const messages = await headers.json();
    const ml = document.querySelector("#messagelist");

    for (const m of messages) {
      const li = document.createElement("li");
      li.textContent = m;
      ml.appendChild(li);
    }

  }




}

window.addEventListener("load", () => {

   console.log("ready");

   getSomeMessages();

});