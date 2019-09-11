export default (theme) => ({
  forms: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  form: {
    flex: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(4)}px`,
    margin: `${theme.spacing(4)}px`,
    maxWidth: `550px`,
    border: '1px solid black',
    borderRadius: `${theme.spacing(1)}px`,
    backgroundColor: theme.palette.background.paper
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
    height: `${theme.spacing(4)}px`
  },
  chipAvatar: {
    height: `${theme.spacing(4)}px`,
    width: `${theme.spacing(4)}px`
  },
  games: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  card: {
    margin: `${theme.spacing(1)}px`
  },
  newGameCard: {
    display: 'flex',
    justifyContent: 'center'
  },
  gameCard: {
    minWidth: '350px',
    maxWidth: '500px',
    flex: 1
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: `${theme.spacing(2)}px`
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: `${theme.spacing(1)}px`,
    marginBottom: `${theme.spacing(2)}px`
  },
  cardAvatar: {
    marginRight: `${theme.spacing(2)}px`
  },
  cardStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: `${theme.spacing(2)}px`
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `${theme.spacing(2)}px`,
    marginTop: `${theme.spacing(1)}px`
  },
  loading: {
    marginTop: `${theme.spacing(8)}px`
  }
});
