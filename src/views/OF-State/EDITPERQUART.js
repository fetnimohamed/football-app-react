import React, { useEffect, useState, useRef, useContext } from 'react';
import useOfService from 'services/ofService';
import { Stack } from '@material-ui/core';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import useFicheSuiveuseService from 'services/ficheSuiveuseService';

export default function EDITPERQUART({ data, correctionData, quart, close, ofData, user, machine }) {
  const { correctionReworkRejectMachineStatus } = useFicheSuiveuseService();
  const [pb, setPb] = useState(0);
  const [prb, setPrb] = useState(0);
  const [pret, setPret] = useState(0);
  const [pADQ, setPADQ] = useState(0);
  const [quartCode, setQuartCode] = useState(quart);
  const { getCorrectionData, editOF, getOFById, getAllOfByMachine } = useOfService();
  useEffect(async () => {
    let quartCd = quart?.slice(0, quart?.length - 8) === 'midi' ? 'Aprés midi' : quart?.slice(0, quart?.length - 8);

    quartCd +=
      ' ' +
      quart?.slice(quart?.length - 8, quart?.length - 6) +
      '/' +
      quart?.slice(quart?.length - 6, quart?.length - 4) +
      '/' +
      quart?.slice(quart?.length - 4, quart?.length + 1);
    setQuartCode(quartCd);
    setPb(Number(correctionData.pbonnes));
    setPrb(Number(correctionData.prebutes));
    setPret(Number(correctionData.pretouche));
    setPADQ(Number(correctionData.pattenteDQ));
    console.log('dataaaaaaa', data);
  }, []);
  return (
    <Stack direction="row" spacing={1} margin={1}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const updateData = [
            Number(pb) - Number(correctionData.pbonnes),
            Number(pret) - Number(correctionData.pretouche),
            Number(prb) - Number(correctionData.prebutes),
            Number(pADQ) - Number(correctionData.pattenteDQ),
          ];
          console.log(
            Number(pb) +
              Number(prb) +
              Number(pret) +
              Number(pADQ) -
              (Number(data.pbonnes) + Number(data.prebutes) + Number(data.pretouche) + Number(data.pattenteDQ)),
          );
          if (
            updateData[0] +
              updateData[1] +
              updateData[2] +
              updateData[3] +
              (Number(data.pbonnes) + Number(data.prebutes) + Number(data.pretouche) + Number(data.pattenteDQ)) <=
            ofData.quantity
          ) {
            console.log(updateData);
            updateData.map((quantity, index) => {
              if (quantity !== 0) {
                console.log(
                  {
                    code: index + 1,
                    quantity: quantity,
                    editTime: Date.now(),
                    of: data.of,
                    matricule: user.matricule,
                    articleCode: ofData.articleCode,
                    quartCode: quart,
                  },
                  data.machine,
                );

                editOF(
                  {
                    code: index + 1,
                    quantity: quantity,
                    editTime: Date.now(),
                    of: data.of,
                    matricule: user.matricule,
                    articleCode: ofData.articleCode,
                    quartCode: quart,
                  },
                  data.machine,
                );
              }
            });
            await correctionReworkRejectMachineStatus({
              of: data.of,
              nbRT: updateData[1],
              nbRJ: updateData[2],
              quartCode: quart,
              machineId: data.machine,
            });
            console.log('dddddd', data.machine);
            //to get the status
            // await getAllOfByMachine(data.machine);
            setTimeout(async () => {
              close();
            }, 500);
            toast.success('correction validé avec success');
          } else {
            toast.error('Veuillez verifier les values de correction!');
          }
        }}
      >
        <TextField
          style={{ margin: '2px', width: '7%' }}
          id="standard-basic"
          label="OF"
          variant="standard"
          value={data.of}
          disabled
        />
        <TextField
          style={{ margin: '2px', width: 'auto' }}
          id="standard-basic"
          label="Machine"
          variant="standard"
          value={machine}
          disabled
        />
        <TextField
          style={{ margin: '2px', width: 'auto' }}
          id="standard-basic"
          label="Quart"
          variant="standard"
          value={quartCode}
          disabled
        />
        <TextField
          style={{ margin: '2px', width: 'auto' }}
          id="standard-basic"
          label="Article"
          variant="standard"
          value={data.articleCode}
          disabled
        />
        <TextField
          style={{ margin: '2px', width: '10%' }}
          id="standard-basic"
          label="Quantité"
          variant="standard"
          value={data.quantity}
          disabled
        />
        <TextField
          style={{ margin: '2px', width: '7%' }}
          id="outlined-adornment-email-lin"
          type="number"
          value={pb}
          name="pbonnes"
          label="pbonnes"
          autoFocus={true}
          onChange={(e) => setPb(Number(e.target.value))}
          inputProps={{ min: 0 }}
        />{' '}
        {/* ({data.pbonnes - correctionData.pbonnes}) */}
        <TextField
          style={{ margin: '2px', width: '7%' }}
          id="outlined-adornment-email-lo"
          type="number"
          value={prb}
          name="pretouche"
          onChange={(e) => setPrb(Number(e.target.value))}
          label="P.Retouches"
          inputProps={{ min: 0 }}
        />{' '}
        {/* ({data.nb_retouches - correctionData.pretouche}) */}
        <TextField
          style={{ margin: '2px', width: '7%' }}
          id="outlined-adornment-email-logi"
          type="number"
          name="prebutes"
          value={pret}
          onChange={(e) => setPret(Number(e.target.value))}
          label="P.Rebutes"
          inputProps={{ min: 0 }}
        />{' '}
        {/* ({data.nb_rebutes - correctionData.prebutes}) */}
        <TextField
          style={{ margin: '2px', width: '7%' }}
          id="outlined-adornment-email"
          type="number"
          value={pADQ}
          name="pattenteDQ"
          onChange={(e) => setPADQ(Number(e.target.value))}
          label="p.attend dis"
          inputProps={{ min: 0 }}
        />{' '}
        {/* ({data.nb_ADQ - correctionData.pattenteDQ}) */}
        <Button
          disableElevation
          sx={{ margin: '3px', width: '5%' }}
          size="small"
          type="submit"
          variant="contained"
          color="success"
        >
          Sauvegarder
        </Button>
        <Button
          disableElevation
          sx={{ margin: '3px', width: '5%' }}
          size="small"
          variant="contained"
          color="error"
          onClick={close}
        >
          Annuler
        </Button>
      </form>
    </Stack>
  );
}
