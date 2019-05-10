export default theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0
  },
  listFragment: {
    display: 'flex',
    alignItems: 'center'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatar: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  leftSide: {
    display: 'flex',
  },
  center: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  rightSide: {
    display: 'flex',
    textAlign: 'right'
  },
  versus: {

  }
});
