export default (theme) => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(1)
  }
});
