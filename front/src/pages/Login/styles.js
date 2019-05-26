export default (theme) => ({
  form: {
    maxWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(4)}px`,
    margin: '0 auto',
    border: '1px solid black',
    borderRadius: `${theme.spacing(1)}px`,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    marginTop: `${theme.spacing(2)}px`,
  }
});
