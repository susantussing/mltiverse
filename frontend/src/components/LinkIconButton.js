import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Icon from 'react-feather';

function LinkIconButton({
  to, icon, color = 'currentColor', size = 24,
}) {
  const IconComponent = Icon[icon];
  const history = useHistory();
  function handleClick() {
    history.push(to);
  }
  return (
    <IconComponent size={size} color={color} onClick={handleClick} />
  );
}

export default LinkIconButton;
