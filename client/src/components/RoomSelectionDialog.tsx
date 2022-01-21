import React, { useState } from 'react'
import logo from '../assets/logo.png'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { BackgroundMode } from '../../../types/BackgroundMode'
import { useAppSelector } from '../hooks'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import { SpawnLocation } from '../../../types/Scenes'

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
`

export default function RoomSelectionDialog() {
  const [showSnackbar, setShowSnackbar] = useState(false)
  const serverConnected = useAppSelector((state) => state.user.serverConnected)
  const backgroundMode = useAppSelector((state) => state.user.backgroundMode)

  const handleConnect = (spawnLocation: SpawnLocation) => {
    if (serverConnected) {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.launchGame(spawnLocation)
    } else {
      setShowSnackbar(true)
    }
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false)
        }}
      >
        <Alert
          severity="error"
          variant="outlined"
          // overwrites the dark theme on render
          style={{ background: '#fdeded', color: '#7d4747' }}
        >
          Connecting to server, please try again in a few seconds!
        </Alert>
      </Snackbar>
      <Backdrop>
        <Wrapper>
          <Title>Welcome to SkyOffice</Title>
          <Content>
            <img src={logo} alt="logo" />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleConnect(SpawnLocation.DEMO_AREA)}
            >
              First time here, go to demo area
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleConnect(SpawnLocation.LOBBY_A)}
            >
              Go directly to Lobby A
            </Button>
          </Content>
        </Wrapper>
        {!serverConnected && (
          <ProgressBarWrapper>
            <h3 style={{ color: backgroundMode === BackgroundMode.DAY ? '#217565' : '#42eacb' }}>
              Connecting to server...
            </h3>
            <ProgressBar color="secondary" />
          </ProgressBarWrapper>
        )}
      </Backdrop>
    </>
  )
}
