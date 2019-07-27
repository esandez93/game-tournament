export default (theme) => ({
  container: {
    display: 'flex',
    flex: 1
  },
  selectors: {
    position: 'absolute',
    right: `${theme.spacing(4)}px`,
    top: 0
  },
  selector: {
    zIndex: 1
  },
  selectorInput: {
    height: `${theme.spacing(6)}px`,
    boxSizing: 'border-box'
  }
});
