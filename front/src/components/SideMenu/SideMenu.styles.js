const drawerWidth = 240;

export default theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(8) + 1
  },
  header: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  secondaryText: {
    color: theme.palette.text.secondary
  },
  avatar: {
    cursor: 'pointer',
    height: theme.spacing(6),
    width: theme.spacing(6),
    marginRight: theme.spacing(2)
  },
  error: {
    backgroundColor: theme.palette.error.light,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    }
  },
  divider: {
    margin: `${theme.spacing(1)}px 0px`
  }
});
