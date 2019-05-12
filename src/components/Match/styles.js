export default theme => ({
  upperSide: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  downSide: {
    height: `${theme.spacing(4) + 2}px`,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatar: {
    height: theme.spacing(6),
    width: theme.spacing(6)
  },
  userInfo: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  leftSide: {
    display: 'flex',
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
  centerVertical: {
    display: 'flex',
    alignItems: 'center'
  },
  versus: {
    fontSize: '56px',
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
  }
});
