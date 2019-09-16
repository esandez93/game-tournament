export default (theme) => ({
  root: {

  },
  small: {
    height: `${theme.spacing(4)}px`,
    width: `${theme.spacing(4)}px`,
    fontSize: '1rem'
  },
  default: {
    height: `${theme.spacing(5)}px`,
    width: `${theme.spacing(5)}px`,
    fontSize: '1.25rem'
  },
  big: {
    height: `${theme.spacing(7)}px`,
    width: `${theme.spacing(7)}px`,
    fontSize: '1.5rem'
  },
  square: {
    borderRadius: `${theme.spacing(1) / 2}px`
  }
});
