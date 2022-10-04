import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react'




const NonTrgTable = ({ data }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Non Trg</TableCell>
                        <TableCell align="right">Non Trg Value en %</TableCell>
                        <TableCell align="right">Temps de perte</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.loss}
                            </TableCell>
                            <TableCell align="right">{row.nonTrgValue}</TableCell>
                            <TableCell align="right">{Math.floor(row.globalTimeOfLosses / 3600)}H</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

}


export default NonTrgTable;