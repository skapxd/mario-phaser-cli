const AUDIOS_MAP = [
  {
    key: 'gameover',
    path: '/assets/sound/music/gameover.mp3'
  },
  {
    key: 'goomba-stomp',
    path: '/assets/sound/effects/goomba-stomp.wav'
  },
  {
    key: 'coin-pickup',
    path: '/assets/sound/effects/coin.mp3'
  },
  {
    key: 'powerup',
    path: '/assets/sound/effects/consume-powerup.mp3'
  }
] as const

export const initAudio = ({ load }: Phaser.Scene) => {
  AUDIOS_MAP.forEach((e) => load.audio(e.key, e.path))
}

export const playAudio = (id: typeof AUDIOS_MAP[number]['key'], game: Phaser.Scene) => {
  game.sound.play(id)
}