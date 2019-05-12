import React from 'react';
import './CharacterAvatar.scss';
import styles from './styles.js';

import avatars from '@/assets/img/characters/avatars';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

function CharacterAvatar (props) {
  const {
    character,
    username
  } = props;

  const classes = makeStyles((theme) => ({
    root: {
      position: 'relative',
      height: theme.spacing(4),
      margin: `0 ${theme.spacing(1) / 2}px`,
      border: `1px solid ${character.alive ? theme.palette.text.secondary : theme.palette.error.main}`
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
  }))();

  return (
    <div className={clsx(classes.root)}>
      <div className={clsx({
        [classes.shadow]: !character.alive
      })}></div>
      <img
        className={clsx(classes.characterAvatar)}
        src={avatars[character.name.toLowerCase()]}
        alt={`${username} - ${character.name}`}
      />
    </div>
  )
}

export default CharacterAvatar;
