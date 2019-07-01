export default (theme) => ({
  inlinePlayer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  center: {
    position: 'relative',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6)
  },
  versus: {
    marginTop: `-${theme.spacing(5)}px`,
    left: '50%',
    marginLeft: `-25%`,
    width: '50%',
  },
  divider: {
    margin: `${theme.spacing(1)}px ${theme.spacing(4)}px`
  },
  team: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    flex: 1,
    maxWidth: '50%'
  },
  downTeam: {
    maxWidth: '100%'
  },
  alignCenter: {
    textAlign: 'center'
  }
});
