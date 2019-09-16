export default (theme) => ({
  header: {
    height: `${theme.spacing(8)}px`
  },
  title: {
    paddingTop: `${theme.spacing(1.5)}px`,
    paddingBottom: `${theme.spacing(1.5)}px`,
    marginLeft: `${theme.spacing(3)}px`
  },
  selectors: {
    position: 'absolute',
    right: `${theme.spacing(4)}px`,
    top: 0
  },
  selector: {
    marginTop: `${theme.spacing(1.5)}px`,

    '&:last-child': {
      marginLeft: `${theme.spacing(2)}px`
    }
  },
  selectorInput: {
    height: `${theme.spacing(6)}px`,
    boxSizing: 'border-box'
  }
});
