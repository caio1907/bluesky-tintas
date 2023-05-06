import React, { useEffect, useState } from 'react';
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material';
import screens from '../../../screens';
import NavLink from '../NavLink';
import useStyles from './styles';
import { loadCurrentUser } from '../../../utils/user';
import { User } from '../../../types';

interface Props {
  open: boolean,
  onClose?: () => void
}

export const Sidebar:React.FC<Props> = ({ open, onClose }) => {
  const [user, setUser] = useState<User>();
  const classes = useStyles();
  const lgUp = useMediaQuery((theme:any) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });
  useEffect(() => {
    loadCurrentUser().then(result => {
      if (!result) return;
      setUser(result);
    });
  }, []);

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2
        }}>
          <img src='logo.png' className={classes.logo} alt="BlueSky Tintas" />
        </Box>
        <Divider
          sx={{
            borderColor: '#2D3748',
            mb: 1
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {screens.filter(screen => screen.onlyAdmin ? user?.admin : true).map((item, index) => (
            <NavLink
              {...item}
              key={index}
            />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor='left'
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant='temporary'
    >
      {content}
    </Drawer>
  );
};

export default Sidebar;
