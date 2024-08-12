import { createAnimations } from './animations';
import { controls } from './control';
import { playAudio, initAudio } from './init/init-audio';
import { AUTO, Game, Types } from 'phaser';
import { initSpriteSheet } from './init/init-spritesheet';

let keys: Phaser.Types.Input.Keyboard.CursorKeys | null | undefined

type Entity = Types.Physics.Arcade.SpriteWithDynamicBody
export type MarioEntity = Entity & { isDead?: boolean; isGrown: boolean; isBlocked: boolean }

let mario: MarioEntity | null | undefined
let enemy: Entity | null | undefined


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    autoFocus: false,
    type: AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250, x: 0 },
            debug: true
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

function preload(this: Phaser.Scene) {
    this.load.image("cloud1", '/assets/scenery/overworld/cloud1.png')

    this.load.image("floorbricks", '/assets/scenery/overworld/floorbricks.png')

    this.load.image("supermushroom", '/assets/collectibles/super-mushroom.png')

    initAudio(this)
    initSpriteSheet(this)
}


function create(this: Phaser.Scene) {
    this.add.image(100, 50, 'cloud1')
        .setOrigin(0, 0)
        .setScale(0.15)

    let floor = this.physics.add.staticGroup()
    floor.create(0, config.height as number, 'floorbricks')
        .setOrigin(0, 1)
        .refreshBody()

    floor.create(150, config.height as number, 'floorbricks')
        .setOrigin(0, 1)
        .refreshBody()

    mario = this.physics.add.sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)

    enemy = this.physics.add.sprite(120, 100, 'goomba')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        .setVelocityX(-50)

    this.physics.world.setBounds(0, 0, 2000, config.height as number)
    this.cameras.main.setBounds(0, 0, 2000, config.height as number)
    this.cameras.main.startFollow(mario)
    this.physics.add.collider(mario, floor)
    this.physics.add.collider(enemy, floor)
    this.physics.add.collider(mario, enemy, (a, b) => onHitEnemy(a, b, this))

    createAnimations(this)

    const collectibles = this.physics.add.staticGroup()
    collectibles.create(150, 150, 'coin').anims.play('coin-idle', true)
    collectibles.create(150, 200, 'supermushroom')
    this.physics.add.overlap(mario, collectibles, (a, b) => collectItem(a, b, this))

    enemy.anims.play('goomba-walk', true)

    keys = this.input.keyboard?.createCursorKeys()

}

function collectItem(mario: MarioEntity, item: Entity, game: Phaser.Scene) {
    const { texture: { key } } = item
    item.destroy()

    if (key === 'coin') {
        playAudio('coin-pickup', game)
        addToScore(item, '100', game)
    } else if (key === 'supermushroom') {
        game.physics.world.pause()
        game.anims.pauseAll()

        playAudio('powerup', game)

        let i = 0
        const interval = setInterval(() => {
            i++
            mario.anims.play(i % 2 === 0
                ? 'mario-grown-idle'
                : 'mario-idle'
            )
        }, 100)
        mario.isBlocked = true
        
        setTimeout(() => {
            mario.setDisplaySize(18, 32)
            mario.body.setSize(18, 32)
            mario.isGrown = true
            mario.isBlocked = false
            // mario.refreshBody()
            game.physics.resume()
            game.anims.resumeAll()
            clearInterval(interval)
        }, 1000)
    }
}

function addToScore(origin: { x: number, y: number }, score: string, game: Phaser.Scene,) {
    const scoreText = game.add.text(origin.x, origin.y, score, {
        fontFamily: 'pixel',
        fontSize: 8
    })

    game.tweens.add({
        targets: scoreText,
        duration: 500,
        y: scoreText.y - 20,
        onComplete: () => {
            game.tweens.add({
                targets: scoreText,
                duration: 100,
                alpha: 0,
                onComplete: () => {
                    scoreText.destroy()
                }
            })
        }
    })
}

function onHitEnemy(mario: Entity, goomba: Entity, game: Phaser.Scene) {
    if (mario?.body.touching.down && enemy?.body.touching.up) {
        mario.setVelocityY(-200)
        enemy.anims.play('goomba-hurt', true)
        goomba.setVelocityX(0)
        playAudio('goomba-stomp', game)
        addToScore(goomba.getBounds(), '100', game)
        setTimeout(() => {
            goomba.destroy()
        }, 500)
    } else {
        killMario(game)
    }
}

function update(this: Phaser.Scene) {
    if (keys == null || mario == null) return

    controls({ keys, mario })

    if (+mario?.y >= +config?.height) {
        killMario(this)

    }
}

function killMario(game: Phaser.Scene) {
    if (mario.isDead) return
    mario?.isDead == null && playAudio('gameover', game)
    mario.isDead = true

    mario?.anims.play('mario-dead')
    mario?.setVelocityX(0)

    mario.body.checkCollision.none = true
    setTimeout(() => {
        mario?.setVelocityY(-300)
    }, 100)

    setTimeout(() => {
        game.scene.restart()
    }, 500)
}

export default new Game(config);

