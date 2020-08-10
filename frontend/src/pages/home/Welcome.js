import React from 'react';
import * as Icon from 'react-feather';
import SmallLayout from 'layouts/Small';
import LinkButton from 'components/LinkButton';

function Welcome() {
  return (
    <SmallLayout icon={<Icon.UserPlus />} title="Welcome">
      <LinkButton to="/login" variant="contained" fullWidth color="primary">Login</LinkButton>
      <LinkButton to="/signup" variant="contained" fullWidth color="primary">Sign Up</LinkButton>
    </SmallLayout>
  );
}

export default Welcome;
