import React, { useEffect, useState, useRef } from 'react';
import useOfService from 'services/ofService';

import { Formik } from 'formik';
import { Button, OutlinedInput } from '@mui/material';

import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import useUserService from 'services/usersService';
export default function EditOf(data) {
  let [correctionData, setCorrectionData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [pb, setPb] = useState(0);
  const [prb, setPrb] = useState(0);
  const [pret, setPret] = useState(0);
  const [pADQ, setPADQ] = useState(0);
  const [ofData, setOfData] = useState({});
  const [user, setUser] = useState({});
  const theme = useTheme();
  const { getCorrectionData, editOF, getOFById } = useOfService();
  const { getUser } = useUserService();
  // Use effect
  useEffect(async () => {
    const user = await getUser();
    setUser(user);
    const of = await getOFById(data.data.id);
    console.log('offfffff', data.machine);
    setOfData(of.data.fabricationOrder);
    const cd = await getCorrectionData({
      of: data.data.id,
      machine: data.machine,
    });
    correctionData = cd;
    setCorrectionData(correctionData);
    setInitialData(data.data);
    setPb(correctionData.pbonnes);
    setPrb(correctionData.prebutes);
    setPret(correctionData.pretouche);
    setPADQ(correctionData.pattenteDQ);
    console.log('dataaaaaaa', data.data);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const updateData = [
          Number(pb) - Number(data.data.nb_bonnes),
          Number(pret) - Number(data.data.nb_retouches),
          Number(prb) - Number(data.data.nb_rebutes),
          Number(pADQ) - Number(data.data.nb_ADQ),
        ];
        console.log(updateData);
        if (
          Number(pb) +
            Number(prb) +
            Number(pret) +
            Number(pADQ) -
            (Number(data.data.nb_bonnes) +
              Number(data.data.nb_rebutes) +
              Number(data.data.nb_retouches) +
              Number(data.data.nb_ADQ)) <=
          ofData.quantity
        ) {
          updateData.map((quantity, index) => {
            if (quantity !== 0) {
              console.log(index, quantity);

              editOF(
                {
                  code: index + 1,
                  quantity: quantity,
                  editTime: Date.now(),
                  of: data.data.id,
                  matricule: user.matricule,
                  articleCode: ofData.articleCode,
                },
                data.machine,
              );
            }
          });
          data.close();
          toast.success('correction validé avec success');
        } else {
          toast.error('Veuillez verifier les values de correction!');
        }
      }}
    >
      <OutlinedInput
        style={{ margin: '2px' }}
        id="standard-basic"
        label="Valeur"
        variant="standard"
        value={data.data.id}
        disabled
      />
      <OutlinedInput
        style={{ margin: '2px' }}
        id="standard-basic"
        label="Valeur"
        variant="standard"
        value={ofData.articleCode}
        disabled
      />
      <OutlinedInput
        style={{ margin: '2px' }}
        id="standard-basic"
        label="Valeur"
        variant="standard"
        value={ofData.quantity}
        disabled
      />
      <OutlinedInput
        style={{ margin: '2px' }}
        id="outlined-adornment-email-lin"
        type="number"
        value={pb}
        name="pbonnes"
        label="pbonnes"
        autoFocus={true}
        onChange={(e) => setPb(e.target.value)}
        label="Email Address / Username"
        inputProps={{}}
      />{' '}
      {/* ({data.data.nb_bonnes - correctionData.pbonnes}) */}
      <OutlinedInput
        style={{ margin: '2px' }}
        id="outlined-adornment-email-lo"
        type="number"
        value={pret}
        name="pretouche"
        onChange={(e) => setPret(e.target.value)}
        label="Email Address / Username"
        inputProps={{}}
      />{' '}
      {/* ({data.data.nb_retouches - correctionData.pretouche}) */}
      <OutlinedInput
        style={{ margin: '2px' }}
        id="outlined-adornment-email-logi"
        type="number"
        value={prb}
        name="prebutes"
        onChange={(e) => setPrb(e.target.value)}
        label="Email Address / Username"
        inputProps={{}}
      />{' '}
      {/* ({data.data.nb_rebutes - correctionData.prebutes}) */}
      <OutlinedInput
        style={{ margin: '2px' }}
        id="outlined-adornment-email"
        type="number"
        value={pADQ}
        name="pattenteDQ"
        onChange={(e) => setPADQ(e.target.value)}
        label="Email Address / Username"
        inputProps={{}}
      />{' '}
      {/* ({data.data.nb_ADQ - correctionData.pattenteDQ}) */}
      <Button disableElevation sx={{ margin: '3px' }} size="small" type="submit" variant="contained" color="success">
        Sauvegarder
      </Button>
      <Button
        disableElevation
        sx={{ margin: '3px' }}
        size="small"
        variant="contained"
        color="error"
        onClick={data.close}
      >
        Annuler
      </Button>
    </form>
  );
}
