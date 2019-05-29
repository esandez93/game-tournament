export default (theme) => ({
  root: {
    position: 'relative',
    height: theme.spacing(4),
    margin: `0 ${theme.spacing(1) / 2}px`
  },
  shadow: {
    position: 'absolute',
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backgroundImage: `
      linear-gradient(
        to top left,
        transparent 0%,
        transparent calc(50% - 4px),
        ${theme.palette.error.main} 50%,
        transparent calc(50% + 4px),
        transparent 100%
      )`
  },
  characterAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  }
});
