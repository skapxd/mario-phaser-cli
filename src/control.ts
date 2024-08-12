import type { Types } from 'phaser';
import type { MarioEntity } from './main';

const MARIO_ANIMATIONS = {
  normal: {
    idle: 'mario-idle',
    walk: "mario-walk",
    jump: 'mario-jump',
  },
  grown: {
    idle: 'mario-grown-idle',
    walk: "mario-grown-walk",
    jump: 'mario-grown-jump',
  }
}

interface Props {
  keys: Phaser.Types.Input.Keyboard.CursorKeys
  mario: MarioEntity
}
export const controls = ({ keys, mario }: Props) => {

  const isMarioTouchingFloor = mario?.body.touching.down
  const isLeftKeyDown = keys?.left.isDown
  const isRightKeyDown = keys?.right.isDown
  const isUpKeyDown = keys?.up.isDown

  if (mario?.isDead) return
  if (mario?.isBlocked) return

  const marioAnimations = mario.isGrown
    ? MARIO_ANIMATIONS.grown
    : MARIO_ANIMATIONS.normal

  if (isLeftKeyDown && mario?.x > 2) {
    mario?.setVelocityX(-80)
    mario?.setFlipX(true)
    isMarioTouchingFloor && mario?.anims.play(marioAnimations.walk, true)
  } else if (isRightKeyDown) {
    mario?.setVelocityX(80)
    isMarioTouchingFloor && mario?.anims.play(marioAnimations.walk, true)
    mario?.setFlipX(false)
  } else if (isMarioTouchingFloor) {
    mario?.anims.play(marioAnimations.idle, true)
    mario?.setVelocityX(0)
  }

  if (isUpKeyDown && isMarioTouchingFloor) {
    mario?.setVelocityY(-150)
    mario?.anims.play(marioAnimations.jump, true)
  }
}