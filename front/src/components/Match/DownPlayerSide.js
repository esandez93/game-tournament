import React, { Fragment, useState } from 'react';

import clsx from 'clsx';

import { useTheme } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {
  CharacterAvatar,
  ContextMenu
} from '@/components';
import { LocaleContext } from '@/context';

function DownPlayerSide (props) {
  const {
    className,
    classes,
    player,
    team,
    availableCharacters,
    isCreating,
    translate,
    clickCharacter,
    deleteCharacter,
    ...other
  } = props;

  const [ characterMenu, setCharacterMenu ] = useState({
    open: false,
    x: -1000,
    y: -1000
  });
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ clickedCharacter, setClickedCharacter ] = useState(null);

  const theme = useTheme();
  const characterAvatarSize = theme.spacing(4);

  function selectCharacterMenu (event) {
    if (!isCreating) return;

    event.preventDefault();

    setCharacterMenu({
      open: true,
      x: event.clientX,
      y: event.clientY
    });
  }

  function closeCharacterMenu() {
    setCharacterMenu({
      open: false,
      x: -1000,
      y: -1000
    })
  }

  function openMenu(event, index) {
    setAnchorEl(event.currentTarget);
    setClickedCharacter(index);
    event.preventDefault();
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  return (
    <div className={clsx(className)} {...other}>
      {team.map((character, index) =>
        <CharacterAvatar
          key={character.id}
          className={clsx(classes.characterAvatar, {
            // [classes.selectableCharacterAvatar]: isCreating
          })}
          height={characterAvatarSize}
          width={characterAvatarSize}
          username={player.username}
          character={character}
          shadow={clsx({
            [classes.selectableCharacterAvatarShadow]: isCreating && character.alive,
            [classes.selectableDeadCharacterAvatarShadow]: isCreating && !character.alive,
          })}
          onClick={() => isCreating ? clickCharacter(character) : null}
          onContextMenu={(e) => isCreating ? openMenu(e, index) : null}
        />
      )}
      <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={closeMenu}>
        <MenuItem onClick={() => {
          closeMenu();
          setTimeout(() => clickCharacter(team[clickedCharacter]), 100);
        }}>{clickedCharacter !== null && team[clickedCharacter] ? translate(team[clickedCharacter].alive ? 'Dead' : 'Alive' ) : null}</MenuItem>
        <MenuItem onClick={() => {
          closeMenu();
          deleteCharacter(clickedCharacter);
        }}>{translate('Delete')}</MenuItem>
      </Menu>
      {isCreating && team.length < 8 && (<Fragment>
        <IconButton
          className={clsx(classes.newCharacterButton, classes.characterAvatar)}
          onContextMenu={(e) => selectCharacterMenu(e)}
          onClick={(e) => selectCharacterMenu(e)}
        >
          <AddIcon className={classes.newCharacterIcon} />
        </IconButton>
        <ContextMenu
          className={classes.contextMenu}
          open={characterMenu.open}
          x={characterMenu.x}
          y={characterMenu.y}
          closeMenu={closeCharacterMenu}
        >
          {availableCharacters.map((character, index) => {
            return (<Fragment key={character.id}>
              <CharacterAvatar
                key={character.id}
                className={clsx(classes.characterAvatar, classes.selectableCharacterAvatar)}
                onClick={() => clickCharacter(character)}
                height={characterAvatarSize * 1.5}
                width={characterAvatarSize * 1.5}
                username={player.username}
                character={character}
                shadow={classes.selectableCharacterAvatarShadow}
              />
              {(index+1) % 5 === 0 ? <br key={index} /> : null}
            </Fragment>)
          })}
        </ContextMenu>
      </Fragment>)}
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) => <DownPlayerSide {...props} translate={locale.translate} ref={ref} />}
  </LocaleContext.Consumer>
));
