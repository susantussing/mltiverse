/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { withStyles } from '@material-ui/core';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';

const styles = (theme) => ({
  inputWindow: {
    padding: theme.spacing(1),
    '& textarea': {
      fontFamily: 'Fira Code',
      fontSize: '0.75rem',
    },
  },
  inputDisabled: {
    backgroundColor: theme.palette.grey[100],
  },
});

function Input({ classes, handleSubmit, isConnected }) {
  return (
    <div
      className={classes.inputWindow}
      onKeyDown={(event) => {
        // Allows multiple commands to be entered together by hitting shift-enter to
        // insert line breaks.
        if (event.which === 13 && !event.shiftKey) {
          event.preventDefault();
          handleSubmit();
        }
      }}
    >
      <Field
        name="command"
        as="textarea"
        component={TextField}
        fullWidth
        multiline
        rows={4}
        disabled={!isConnected}
        variant="outlined"
        InputProps={{
          classes: {
            disabled: classes.inputDisabled,
          },
        }}
      />
    </div>
  );
}

export default withStyles(styles)(Input);
