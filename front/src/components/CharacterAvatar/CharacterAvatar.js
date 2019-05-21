import React from 'react';
import './CharacterAvatar.scss';
import styles from './styles.js';

import avatars from '@/assets/img/characters/avatars';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

function CharacterAvatar (props) {
  const {
    className,
    character,
    username,
    width,
    height,
    shadow,
    ...other
  } = props;

  const classes = makeStyles((theme) => ({
    root: {
      position: 'relative',
      height: height || theme.spacing(4),
      border: `1px solid ${character.alive === false ? theme.palette.error.main : theme.palette.text.secondary}`
    },
    shadow: {
      position: 'absolute',
      width: width || theme.spacing(4),
      height: height || theme.spacing(4),
    },
    death: {
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
      width: width || theme.spacing(4),
      height: height || theme.spacing(4),
    }
  }))();

  return (
    <div className={clsx(className, classes.root)} {...other}>
      <div className={clsx(classes.shadow, shadow, {
        [classes.death]: character.alive === false
      })}></div>
      <img
        className={clsx(classes.characterAvatar)}
        src={avatars[character.name.toLowerCase()]}
        alt={`${username ? username + ' - ' : ''}${character.name}`}
      />
    </div>
  )
}

export default CharacterAvatar;
