import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import { red } from '@mui/material/colors'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import { Button } from '@mui/material'

const officeRooms: string[] = []
for (let i = 0; i < 10; i++) {
  officeRooms.push(`A${i}`)
}

const Wrapper = styled.div`
  display: none;
`

export default function OfficeDeskDialogs() {
  return (
    <>
      {officeRooms.map((room) => (
        <Wrapper id={`dialog-${room}`}>
          <Card
            sx={{
              width: 160,
              display: 'flex',
              flexDirection: 'column',
              background: '#000000a7',
            }}
          >
            <CardHeader
              sx={{ padding: '4px 16px', fontSize: 10 }}
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500], width: 24, height: 24, fontSize: 12 }}
                  aria-label="recipe"
                >
                  {room}
                </Avatar>
              }
              titleTypographyProps={{ variant: 'caption' }}
              title={`Office ${room}`}
              subheaderTypographyProps={{ variant: 'inherit' }}
              subheader="Available"
            />
            <CardActions disableSpacing sx={{ justifyContent: 'center', padding: '4px' }}>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<AddBusinessIcon />}
                sx={{ fontSize: 10 }}
              >
                Claim
              </Button>
            </CardActions>
          </Card>
        </Wrapper>
      ))}
    </>
  )
}
