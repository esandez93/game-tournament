export default theme => ({
  upperSide: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  downSide: {
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatar: {
    height: theme.spacing(6),
    width: theme.spacing(6)
  },
  characterAvatar: {
    margin: `${theme.spacing(1) / 2}px`,
    display: 'inline-block',
    userSelect: 'none'
  },
  userInfo: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  leftSide: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '35%',
  },
  center: {
    position: 'relative',
    display: 'flex',
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  rightSide: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '35%',
    textAlign: 'right',
    float: 'right'
  },
  secondaryColor: {
    color: theme.palette.text.secondary
  },
  flex: {
    display: 'flex'
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  win: {
    color: 'rgb(40, 175, 65)'
  },
  lose: {
    color: theme.palette.error.main,
  },
  newHeader: {
    position: 'relative',
    height: `${theme.spacing(3)}px`,
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.main
  },
  newHeaderText: {
  },
  newHeaderIcon: {
    position: 'absolute',
    right: '0px',
    top: '0px',
    padding: `0px ${theme.spacing(1)}px 0px 0px`,
  },
  centerVertical: {
    display: 'flex',
    alignItems: 'center'
  },
  versus: {
    fontSize: `${theme.spacing(8)}px`,
    position: 'absolute',
    display: 'block',
    textAlign: 'center',
    width: '80%',
    color: theme.palette.error.dark,
    backgroundColor: theme.palette.background.paper,
    top: '50%',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  newMatch: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  newCharacterButton: {
    padding: 0,
    border: `1px solid ${theme.palette.text.secondary}`,
    borderRadius: 0,
    boxSizing: 'content-box',
    height: `${theme.spacing(4)}px`,
    width: `${theme.spacing(4)}px`,
    '&:hover': {
      borderColor: theme.palette.primary.main,
    }
  },
  newCharacterIcon: {
    color: theme.palette.text.secondary,
    borderColor: theme.palette.text.secondary,
    fontSize: theme.spacing(4),
    '&:hover': {
      color: theme.palette.background.paper,
      backgroundColor: theme.palette.primary.main,
    }
  },
  contextMenu: {
    border: `1px solid ${theme.palette.text.secondary}`,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1)
  },
  selectableUserAvatar: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  selectableUser: {
    display: 'flex',
    boxSizing: 'border-box',
    border: `1px solid transparent`,
    margin: `${theme.spacing(1) / 2}px`,
    cursor: 'pointer',
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`
    }
  },
  selectedUser: {
    cursor: 'not-allowed',
    border: `1px solid ${theme.palette.text.secondary}`,
    backgroundColor: theme.palette.text.secondary,
    '&:hover': {
      border: `1px solid ${theme.palette.text.secondary}`
    }
  },
  selectableCharacterAvatar: {
    margin: `${theme.spacing(1) / 2}px`,
    cursor: 'pointer',
    '&:hover': {
      borderColor: theme.palette.primary.main
    }
  },
  selectableCharacterAvatarShadow: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
  },
  selectableDeadCharacterAvatarShadow: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    '&:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)'
    },
  },
  createButton: {
    margin: `${theme.spacing(1)}px 0`
  },
  tooltip: {
    backgroundColor: theme.palette.error.dark,
    marginTop: `${theme.spacing(1)}px`,
    padding: `${theme.spacing(1)}px`,
  }
});
