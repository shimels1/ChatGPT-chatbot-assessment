const form = document.querySelector('form');
const chatContainer = document.querySelector('#chatContainer');

let loadInterval;

function loading(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  const interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}


function UniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(15);

  return `id-${timestamp}-${hexadecimalString}`;
}

function message(isAi, message, newID) {
  return `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src="${isAi ? 'assets/bot.svg' : 'assets/user.svg'}" 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${newID}>${message}</div>
            </div>
        </div>
    `;
}

if (document.getElementById("send")) {

  document.getElementById("send").onclick = async function () {

  const data = new FormData(form);

  // user's message
  chatContainer.innerHTML += message(false, data.get('prompt'));

  // to clear the textarea input
  form.reset();

  // chatGPT message
  const uniqueId = UniqueId();
  chatContainer.innerHTML += message(true, ' ', uniqueId);

  // to focus scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div
  const messageDiv = document.getElementById(uniqueId);

  // loading ...
  loading(messageDiv);

  const response = await fetch('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  // const response = await fetch('https://chatgpt-api.shn.hk/v1/', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     "model": "gpt-3.5-turbo",
  //     message:[{"role": "user", "content": "Hello, how are you?"}]
  //   }),
  // });

  clearInterval(loadInterval);
  messageDiv.innerHTML = ' ';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.message.trim(); // trims spaces

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = 'Something went wrong';
    console.log(err)
  }

  }}