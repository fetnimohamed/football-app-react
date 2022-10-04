import { Stack } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React from 'react';

const Button = ({ setLocal, setOpen, localId }) => {
  <Stack direction="row" alignItems="end" justifyContent="end" margin={2}>
    <Box
      sx={{
        '& button': { m: 1 },
        display: 'flex',
        justifyContent: 'end',
      }}
    >
      <Button
        color="error"
        variant="contained"
        fullWidth
        onClick={() => {
          setOpen(false);
        }}
      >
        annuler
      </Button>
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        disabled={localId === 0}
        onClick={() => {
          setLocal(localId);
          // console.log(getpath(data, localId));
          setOpen(false);
        }}
      >
        confirmé
      </Button>
    </Box>
  </Stack>;
};
