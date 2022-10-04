import { Button, Stack } from '@material-ui/core';
import { Box } from '@material-ui/system';
import react from 'react';
import useProcessTypeService from 'services/processTypeService';
import { useTranslation } from 'react-i18next';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 7,
  width: '40%',
  maxWidth: '100vw',
  pt: 1,
  px: 4,
  pb: 2,
};

const ConfirmDeleteModal = ({ id, callback, deleteElemnt }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Box
        sx={{
          ...style,
          width: 500,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
          <h3>{t('GENERAL.DELETE_MESSAGE')}</h3>
        </Stack>
        <Box
          sx={{
            '& button': { m: 1 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            size="small"
            margin={1}
            onClick={() => {
              callback();
            }}
          >
            {t('GENERAL.NO')}
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            margin={1}
            onClick={() => {
              deleteElemnt(id);
              callback();
            }}
          >
            {t('GENERAL.YES')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ConfirmDeleteModal;
