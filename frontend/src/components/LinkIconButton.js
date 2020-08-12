import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Icon from 'react-feather';
import { IconButton } from '@material-ui/core';

function LinkIconButton({
  to, icon, color = 'currentColor', size = 24,
}) {
  const IconComponent = Icon[icon];
  const history = useHistory();
  function handleClick() {
    history.push(to);
  }
  return (
    <IconButton onClick={handleClick}>
      <IconComponent size={size} color={color} />
    </IconButton>
  );
}

export default LinkIconButton;
