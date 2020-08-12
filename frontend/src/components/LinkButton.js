import React from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function LinkButton({
  to, children, color = 'default', className,
}) {
  return (
    <Button className={className} variant="contained" fullWidth component={Link} to={to} color={color}>{children}</Button>
  );
}
