const TWITCH_CHAT_WS = "wss://irc-ws.chat.twitch.tv/"
const TWITCH_CHANNEL_NAME = "yanneves_"

const $chat = document.getElementById("chat")
const ws = new WebSocket(TWITCH_CHAT_WS)

ws.onopen = () => {
  console.info(`Connection opened to ${TWITCH_CHAT_WS}`)

  // Handshake
  ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership")
  ws.send(`NICK justinfan${Math.floor(Math.random() * 80000 + 1000)}`)

  // Join channel
  ws.send(`JOIN #${TWITCH_CHANNEL_NAME}`)
}

ws.onclose = () => {
  console.info(`Connection closed to ${TWITCH_CHAT_WS}`)
}

ws.onerror = err => {
  console.info(`WebSockets error`)
  console.dir(err)
}

ws.onmessage = payload => {
  try {
    const { data } = payload
    const messageStart = data.indexOf("PRIVMSG")

    if (messageStart !== -1) {
      // data: "@badge-info=;badges=broadcaster/1,premium/1;color=#1E90FF;display-name=yanneves_;emotes=;flags=;id=a53f950e-8a43-47e1-bcc4-6da12304845d;mod=0;room-id=121220630;subscriber=0;tmi-sent-ts=1582499309095;turbo=0;user-id=121220630;user-type= :yanneves_!yanneves_@yanneves_.tmi.twitch.tv PRIVMSG #yanneves_ :toast
      // ↵"

      const message = data.substr(messageStart + "PRIVMSG ".length)
      console.log(message)
      appendToChat(message)
    } else {
      console.info("Ignored event")
      console.dir(data)
    }
  } catch {
    console.warn("Unknown payload format received")
    console.dir(payload)
  }
}

function appendToChat(message) {
  const $line = document.createElement("li")
  $line.innerText = message

  return $chat.append($line)
}
