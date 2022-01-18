import React from 'react'
import styled from 'styled-components'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import { Button, Avatar } from '@mui/material'
import Adam from '../assets/Adam_login.png'
import Computer from '../assets/computer.png'
import Whiteboard from '../assets/whiteboard.png'
import { getColorByString } from '../util'

// Create an array with strings from 'A1' to 'A9', which is used
// to generate office dialog components for each office space below
const officeRooms: string[] = []
for (let i = 1; i < 10; i++) {
  officeRooms.push(`A${i}`)
}

const Wrapper = styled.div`
  display: none;
  border: 1px solid black;
  border-radius: 10px 10px 10px 0px;
  background: #ffffffe1;
  width: 160px;
  height: 90px;
  text-align: center;

  button {
    font-size: 9px;
    height: 18px;
  }

  .avatar {
    width: 16px;
    height: 16px;
    font-size: 11px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  .title {
    margin: 0;
  }
`

const Description = styled.div`
  .number {
    color: #7e7e7e;
    font-size: 10px;
    font-weight: bold;
  }

  img {
    height: 18px;
    margin: 4px 4px 4px 1px;
  }
`

const StatusBar = styled.div`
  background: #c6f6d5;
  color: #306160;
  font-weight: bold;
  font-size: 9px;
`

export default function OfficeDeskDialogs() {
  return (
    <>
      {officeRooms.map((room, i) => (
        <Wrapper id={`dialog-${room}`}>
          <Header>
            <Avatar className="avatar" style={{ background: getColorByString(i) + '80' }}>
              {room}
            </Avatar>
            <p className="title">Office {room}</p>
          </Header>
          <StatusBar>AVAILABLE</StatusBar>
          <Description>
            <span className="number">3</span>
            <img src={Whiteboard} alt="whiteboard" />
            <span className="number">&bull; 5</span>
            <img src={Computer} alt="computer" />
            <span className="number">&bull; 5-10</span>
            <img src={Adam} alt="user" />
          </Description>
          <Button variant="outlined" color="primary" size="small" startIcon={<AddBusinessIcon />}>
            Claim the space
          </Button>
        </Wrapper>
      ))}
    </>
  )
}
