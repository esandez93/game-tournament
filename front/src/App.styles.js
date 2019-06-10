export default (theme) => ({
  container: {
    display: 'flex',
    flex: 1
  },
  selectors: {
    position: 'absolute',
    right: `${theme.spacing(2)}px`,
    top: 0
  },
  selector: {
    zIndex: 1
  }
});
