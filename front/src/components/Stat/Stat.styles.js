export default (theme) => ({
  root: {
    padding: `${theme.spacing(0.5)}px`
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: `${theme.spacing(0.5)}px`
  },
  title: {
    fontSize: `${theme.typography.fontSize * 0.75}px`
  },
  label: {
    fontSize: `${theme.typography.fontSize * 1.5}px`,
    textAlign: 'centerº'
  },
});
