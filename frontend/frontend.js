document.querySelector('#settings').addEventListener('submit', (e) => {
  e.preventDefault()
  console.log()

  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'set-settings',
      version: 1
    },
    items: Array.from(document.querySelector('#items').options).filter(el => el.selected).map(el => el.value),
    level: Array.from(document.querySelector('#level').options).filter(el => el.selected).map(el => el.value)
  })
})

function showInhibs(side) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'show-inhibs',
      version: 1
    },
    side
  })
}

function hideInhibs() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'hide-inhibs',
      version: 1
    }
  })
}

function testLvl(team) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-level-up',
      version: 1
    },
    team,
    level: document.querySelector('#testLevel').value
  })
}
function testItem(team) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-item',
      version: 1
    },
    team
  })
}

function initSettings(settings) {
  const itemOptions = document.querySelector('#items').options
  for (let i = 0; i < itemOptions.length; i++) {
    const item = itemOptions[i]

    if (settings.items.includes(item.value)) {
      item.selected = true
    }
  }

  const levelOptions = document.querySelector('#level').options
  for (let i = 0; i < levelOptions.length; i++) {
    const level = levelOptions[i]

    if (settings.level.includes(level.value)) {
      level.selected = true
    }
  }
}

LPTE.onready(async () => {
  const port =  await window.constants.getWebServerPort()
  const location = `http://localhost:${port}/pages/op-module-league-in-game/gfx`

  const apiKey = await window.constants.getApiKey()

  document.querySelector('#ingame-embed').value = `${location}/ingame.html${apiKey !== null ? '?apikey=' + apiKey: ''}`
  document.querySelector('#ingame-gfx').src = `${location}/ingame.html${apiKey !== null ? '?apikey=' + apiKey: ''}`

  const settings = await LPTE.request({
    meta: {
      namespace: 'module-league-in-game',
      type: 'get-settings',
      version: 1
    }
  })
  initSettings(settings)

  LPTE.on('module-league-in-game', 'set-settings', initSettings)
})
