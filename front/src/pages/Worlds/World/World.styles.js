export default (theme) => ({
  root: {
    paddingTop: `${theme.spacing(4)}px`
  },
  tabs: {
    position: 'absolute',
  },
  users: {
    padding: 0
  },
  forms: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  form: {
    flex: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(4)}px`,
    margin: `${theme.spacing(4)}px`,
    maxWidth: `550px`,
    border: '1px solid black',
    borderRadius: `${theme.spacing(1)}px`,
    backgroundColor: theme.palette.background.paper
  },
});
