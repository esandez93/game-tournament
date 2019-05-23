import React, { useState } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import {
  Avatar,
  ContextMenu
} from '@/components';

function PlayerInfo (props) {
  const {
    classes,
    className,
    player,
    win,
    clickUser,
    isCreating,
    availableUsers,
    selectedUsers,
    rightSide,
    ...other
  } = props;

  const [ userMenu, setUserMenu ] = useState({
    open: false,
    x: -1000,
    y: -1000
  });

  function selectUserMenu (event) {
    if (!isCreating) return;

    setUserMenu({
      open: true,
      x: event.clientX,
      y: event.clientY
    });

    event.preventDefault();
  }

  function closeUserMenu() {
    setUserMenu({
      open: false,
      x: -1000,
      y: -1000
    })
  }

  const moreClasses = makeStyles(theme => ({
    rightSide: {
      textAlign: 'right'
    }
  }))();

  return (
    <div className={clsx(className, classes.spaceBetween)} dir={rightSide ? 'rtl' : 'ltr'} {...other}>
      <div className={clsx(classes.flex)}>
        <Avatar className={clsx(classes.avatar, {
          [classes.selectableUserAvatar]: isCreating
        })} onClick={(event) => selectUserMenu(event)} src={player.avatar} name={player.name} />
        <span className={clsx(classes.userInfo, { [moreClasses.rightSide]: rightSide })}>
          <Typography variant="body1">{player.username}</Typography>
          <Typography className={classes.secondaryColor} variant="body2">{player.name}</Typography>
        </span>

        <ContextMenu
          className={classes.contextMenu}
          open={userMenu.open}
          x={userMenu.x}
          y={userMenu.y}
          closeMenu={closeUserMenu}
        >
          {availableUsers.map((user, index) => {
            return (<div className={clsx(classes.selectableUser, {
              [classes.selectedUser]: selectedUsers.includes(user.id)
            })} key={index} onClick={() => selectedUsers.includes(user.id) ? null : clickUser(user)}>
              <Avatar className={classes.avatar} src={user.avatar} name={user.name} />
              <span className={classes.userInfo}>
                <Typography variant="body1">{user.username}</Typography>
                <Typography className={classes.secondaryColor} variant="body2">{user.name}</Typography>
              </span>
            </div>)
          })}
        </ContextMenu>
      </div>
      {/* win && <div className={clsx(classes.centerVertical)}>
        <Typography className={clsx(classes.win)} variant="h5">WIN</Typography>
        </div> */}
    </div>
  );
}

export default PlayerInfo;
