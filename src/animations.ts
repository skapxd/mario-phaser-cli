const ANIMATIONS_MAP: (game: Phaser.Scene) => Array<{
  key: string
  frames: Phaser.Types.Animations.AnimationFrame[] // & { key: Sprites, frame?: string | number; duration?: number; visible?: boolean; }[]
  frameRate?: number
  repeat?: number
}> = (game) => [
  {
    key: 'mario-walk',
    frames: game.anims.generateFrameNames('mario', { start: 1, end: 3 }),
    frameRate: 12,
    repeat: -1
  },
  {
    key: 'mario-idle',
    frames: [{ key: 'mario', frame: 0 }],
  },
  {
    key: 'mario-jump',
    frames: [{ key: 'mario', frame: 5 }],
  },
  {
    key: 'mario-dead',
    frames: [{ key: 'mario', frame: 4 }],
  },
  {
    key: 'goomba-hurt',
    frames: [{ key: 'goomba', frame: 2 }],
  },
  {
    key: 'goomba-walk',
    frames: game.anims.generateFrameNames('goomba', { start: 0, end: 1 }),
    frameRate: 12,
    repeat: -1
  },
  {
    key: 'coin-idle',
    frames: game.anims.generateFrameNumbers(
      'coin',
      { start: 0, end: 3 },
    ),
    frameRate: 12,
    repeat: -1
  },
  {
    key: 'mario-grown-idle',
    frames: [{ key: 'mario-grown', frame: 0 }]
  },
  {
    key: 'mario-grown-walk',
    frames: game.anims.generateFrameNumbers(
      'mario-grown',
      { start: 1, end: 3 }
    )
  },
  {
    key: 'mario-grown-jump',
    frames: [{ key: 'mario-grown', frame: 5 }]
  }
]

export const createAnimations = (game: Phaser.Scene) => {
  ANIMATIONS_MAP(game).forEach(e => game.anims.create(e))
}