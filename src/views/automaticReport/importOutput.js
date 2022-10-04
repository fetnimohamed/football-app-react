import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@material-ui/system';
import { Button, Stack } from '@material-ui/core';
import { grey } from '@mui/material/colors';
const ImportOutput = (props) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 7,
    width: '25%',
    maxWidth: '100vw',
    pt: 1,
    px: 4,
    pb: 2,
    display: 'flex',
    justifyContent: 'center',
  };
  console.log(props);
  return (
    <Box sx={{ ...style }}>
      <Stack direction="column" alignItems="center" justifyContent="center" margin={2} spacing={2}>
        <h1>Liste OF</h1>
        <TableContainer component={Paper}>
          <Table sx={{ width: 300, margin: 3 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Opération</TableCell>
                <TableCell align="right">Quantité</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
              // key={row.name}
              >
                <TableCell component="th" scope="row">
                  nouveau OF
                </TableCell>
                <TableCell align="right">{props.data.history.newOf}</TableCell>
              </TableRow>
              <TableRow
              // key={row.name}
              >
                <TableCell component="th" scope="row">
                  OF Mis à jour
                </TableCell>
                <TableCell align="right">{props.data.history.updatedOf}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  OF Archivé
                </TableCell>
                <TableCell align="right">{props.data.history.archivedOf}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Nouveau Article/machine
                </TableCell>
                <TableCell align="right">{props.data.history.newArticle}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Article/machine Mis à jour
                </TableCell>
                <TableCell align="right">{props.data.history.updatedArticle}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  OF Supprimé
                </TableCell>
                <TableCell align="right">{props.data.history.deletedOf}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table sx={{ width: 300, margin: 3 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Etats</TableCell>
                <TableCell align="right">Quantité</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
              // key={row.name}
              >
                <TableCell component="th" scope="row">
                  Total Importé
                </TableCell>
                <TableCell align="right">{props.data.history.rows}</TableCell>
              </TableRow>
              <TableRow
              // key={row.name}
              >
                <TableCell component="th" scope="row">
                  En cours
                </TableCell>
                <TableCell align="right">{props.data.history.activeOF}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  OF Archivé
                </TableCell>
                <TableCell align="right">{props.data.history.doneOF}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          size="small"
          style={{ margin: 10, float: 'right' }}
          margin={1}
          onClick={() => {
            props.close();
          }}
        >
          retour
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center" margin={2}></Stack>
    </Box>
  );
};

export default ImportOutput;
