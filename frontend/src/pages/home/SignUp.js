import React from 'react';
import { useMutation, gql } from '@apollo/client';
import SmallLayout from 'layouts/Small';
import * as Icon from 'react-feather';
import UserForm from '../../components/UserForm';

const ADD_USER = gql`
  mutation UserCreateOne($record: CreateOneUserInput!) {
    userCreateOne(record: $record) {
      record {
        _id
        name
      }
    }
  }
`;

function SignUp() {
  const [addUser] = useMutation(ADD_USER);
  const handleSubmit = async (values, actions) => {
    await addUser({ variables: { record: values } });
    actions.setSubmitting(false);
  };
  return <SmallLayout icon={<Icon.UserPlus />} title="Sign Up"><UserForm handleSubmit={handleSubmit} /></SmallLayout>;
}

export default SignUp;
