export interface ISceneData {
  onLeave: (teleportTo?: string) => void
}

export enum SpawnLocation {
  LOBBY_A,
  DEMO_AREA,
}
