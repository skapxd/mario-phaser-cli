export type SpritesNames = 'mario' | 'goomba' | 'coin' | 'mario-grown';

const SPRITES_SHEET_MAP: Array<{
  key: SpritesNames,
  path: string,
  frameConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig
}> = [
    {
      key: 'mario',
      path: '/assets/entities/mario.png',
      frameConfig: { frameWidth: 18, frameHeight: 16 }
    },
    {
      key: 'goomba',
      path: '/assets/entities/overworld/goomba.png',
      frameConfig: { frameWidth: 16, frameHeight: 16 }
    },
    {
      key: 'coin',
      path: '/assets/collectibles/coin.png',
      frameConfig: { frameWidth: 16, frameHeight: 16 }
    },
    {
      key: 'mario-grown',
      path: '/assets/entities/mario-grown.png',
      frameConfig: { frameWidth: 18, frameHeight: 32 }
    },
  ]

export const initSpriteSheet = ({ load }: Phaser.Scene) => {
  SPRITES_SHEET_MAP.forEach(e => load.spritesheet(e.key, e.path, e.frameConfig))
}