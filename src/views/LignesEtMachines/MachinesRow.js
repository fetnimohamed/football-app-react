import { Link, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import Typography from 'views/utilities/Typography';

const imgUrl = 'https://www.pngall.com/wp-content/uploads/8/Factory-Machine-Production-PNG-Image.png';

function verifyStatus(x) {
  if (x === 'up') {
    return '#70DC5F';
  } else if (x === 'down') {
    return '#FF5454';
  } else {
    return '';
  }
}

export default function MachinesRow({ machines }) {
  return (
    <TableRow key={1}>
      <TableCell align="center">
        <Typography variant="h3">Ligne 1</Typography>
      </TableCell>
      {machines.map((item, i) => (
        <TableCell bgcolor={verifyStatus(item.status)} align="center" key={i}>
          <Typography>
            <img width="85" height="85" src={imgUrl} />
          </Typography>
          <Typography>{item.code}</Typography>
          <Typography>{item.cycle}</Typography>
          <Typography>{item.ref}</Typography>
          <Typography>{item.numero}</Typography>
          <Typography>
            <Link href="#" underline="hover">
              fiche suiveuse
            </Link>
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );
}
