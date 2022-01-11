import Phaser from 'phaser'
import Player from './Player'
import { sittingShiftData } from './Player'

import network from '../services/Network'
import store from '../stores'

export default class OtherPlayer extends Player {
  private targetPosition: [number, number]
  private lastUpdateTimestamp?: number
  private connectionBufferTime = -750
  private connected = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    webRTCId: string,
    name: string,
    readyToConnect: boolean,
    videoConnected: boolean,
    frame?: string | number
  ) {
    super(scene, x, y, texture, id, webRTCId, name, readyToConnect, videoConnected, frame)
    this.targetPosition = [x, y]

    const collisionScale = [9, 6]
    this.body
      .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
      .setOffset(
        this.width * (1 - collisionScale[0]) * 0.5,
        this.height * (1 - collisionScale[1]) * 0.5 + 17
      )
  }

  makeCall() {
    const { loggedIn, videoConnected } = store.getState().user
    if (
      !this.connected &&
      this.connectionBufferTime >= 750 &&
      this.readyToConnect &&
      loggedIn &&
      videoConnected &&
      network.webRTCId > this.webRTCId
    ) {
      network.webRTC?.connectToNewUser(this.webRTCId)
      this.connected = true
      this.connectionBufferTime = 0
    }
  }

  updateOtherPlayer(field: string, value: number | string | boolean) {
    switch (field) {
      case 'name':
        if (typeof value === 'string') {
          this.playerName.setText(value)
        }
        break

      case 'x':
        if (typeof value === 'number') {
          this.targetPosition[0] = value
        }
        break

      case 'y':
        if (typeof value === 'number') {
          this.targetPosition[1] = value
        }
        break

      case 'anim':
        if (typeof value === 'string') {
          this.play(value, true)
        }
        break

      case 'readyToConnect':
        if (typeof value === 'boolean') {
          this.readyToConnect = value
        }
        break

      case 'videoConnected':
        if (typeof value === 'boolean') {
          this.videoConnected = value
        }
        break
    }
  }

  destroy(fromScene?: boolean) {
    this.playerContainer.destroy()

    super.destroy(fromScene)
  }

  /** preUpdate is called every frame for every game object. */
  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)

    // if Phaser has not updated the canvas (when the game tab is not active) for more than 0.75 sec
    // directly snap player to their current locations
    if (this.lastUpdateTimestamp && t - this.lastUpdateTimestamp > 750) {
      this.lastUpdateTimestamp = t
      this.x = this.targetPosition[0]
      this.y = this.targetPosition[1]
      this.playerContainer.x = this.targetPosition[0]
      this.playerContainer.y = this.targetPosition[1] + this.playerContainerOffsetY
      return
    }

    this.lastUpdateTimestamp = t
    this.setDepth(this.y) // change player.depth based on player.y
    const animParts = this.anims.currentAnim.key.split('_')
    const animState = animParts[1]
    if (animState === 'sit') {
      const animDir = animParts[2]
      const sittingShift = sittingShiftData[animDir]
      if (sittingShift) {
        // set hardcoded depth (differs between directions) if player sits down
        this.setDepth(this.depth + sittingShiftData[animDir][2])
      }
    }

    const speed = 200 // speed is in unit of pixels per second
    const delta = (speed / 1000) * dt // minimum distance that a player can move in a frame (dt is in unit of ms)
    let dx = this.targetPosition[0] - this.x
    let dy = this.targetPosition[1] - this.y

    // if the player is close enough to the target position, directly snap the player to that position
    if (Math.abs(dx) < delta) {
      this.x = this.targetPosition[0]
      this.playerContainer.x = this.targetPosition[0]
      dx = 0
    }
    if (Math.abs(dy) < delta) {
      this.y = this.targetPosition[1]
      this.playerContainer.y = this.targetPosition[1] + this.playerContainerOffsetY
      dy = 0
    }

    // if the player is still far from target position, impose a constant velocity towards it
    let vx = 0
    let vy = 0
    if (dx > 0) vx += speed
    else if (dx < 0) vx -= speed
    if (dy > 0) vy += speed
    else if (dy < 0) vy -= speed

    // update character velocity
    this.setVelocity(vx, vy)
    this.body.velocity.setLength(speed)
    // also update playerNameContainer velocity
    this.playerContainerBody.setVelocity(vx, vy)
    this.playerContainerBody.velocity.setLength(speed)

    // while currently connected with myPlayer
    // if myPlayer and the otherPlayer stop overlapping, delete video stream
    this.connectionBufferTime += dt
    if (
      this.connected &&
      !this.body.embedded &&
      this.body.touching.none &&
      this.connectionBufferTime >= 750
    ) {
      network.playerStreamDisconnect(this.playerId, this.webRTCId)
      this.connectionBufferTime = 0
      this.connected = false
    }
  }
}
