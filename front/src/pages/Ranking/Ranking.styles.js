export default theme => ({
  list: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0
  },
  listFragment: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    border: `${theme.spacing(1) / 2}px solid ${theme.palette.background.paper}`
  },
  listItem: {
    paddingLeft: theme.spacing(2)
  },
  gold: {
    borderColor: '#FFDF00'
  },
  silver: {
    borderColor: '#D3D3D3'
  },
  bronze: {
    borderColor: '#CD7F32'
  },
  trophy: {
    width: theme.spacing(2)
  }
});
