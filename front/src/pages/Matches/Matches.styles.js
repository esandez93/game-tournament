export default theme => ({
  list: {
    width: '100%',
    paddingTop: 0
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  customDivider: {
    height: theme.spacing(2)
  }
});
