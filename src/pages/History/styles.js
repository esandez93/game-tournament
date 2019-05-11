export default theme => ({
  list: {
    width: '100%',
    paddingTop: 0
  },
  listFragment: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0,
  },
  upperSide: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  downSide: {
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  },
  avatar: {
    height: theme.spacing(6),
    width: theme.spacing(6),
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
  versus: {
    fontSize: '56px',
    position: 'absolute',
    display: 'block',
    textAlign: 'center',
    width: '80%',
    color: theme.palette.error.main,
    backgroundColor: theme.palette.background.paper,
    top: '50%',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  customDivider: {
    height: theme.spacing(2)
  }
});
