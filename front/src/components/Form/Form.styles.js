import { fade } from '@material-ui/core/styles/colorManipulator';

export default (theme) => ({
  root: {
    position: 'relative'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: `${theme.spacing(2)}px`
  },
  input: {
    boxSizing: 'border-box',
    height: `${theme.spacing(7)}px`
  },
  loading: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: fade(theme.palette.background.default, 0.5),
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});
