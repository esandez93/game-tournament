export default (theme) => ({
  root: {
    maxWidth: '400px',
    margin: 'auto',
  },
  form: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(4)}px`,
    border: '1px solid black',
    borderRadius: `${theme.spacing(1)}px`,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    marginTop: `${theme.spacing(2)}px`,
  },
  title: {
    position: 'absolute',
    top: `-${theme.spacing(4)}px`,
    fontSize: `${theme.spacing(4)}px`,
    padding: `${theme.spacing(1) / 2}px ${theme.spacing(1)}px`,
    border: `${theme.spacing(1) / 4}px solid black`,
    borderRadius: `${theme.spacing(1)}px`,
    backgroundColor: `${theme.palette.background.paper}`,
    backgroundOpacity: '0.5'
  },
  signup: {
    marginTop: `${theme.spacing(2)}px`,
    paddingLeft: `${theme.spacing(1)}px`
  }
});
