import React, { useEffect, useState, useRef, useContext } from 'react';
import useOfService from 'services/ofService';

import { Formik } from 'formik';
import { Button, OutlinedInput } from '@mui/material';

import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import useUserService from 'services/usersService';
import { Stack } from '@material-ui/core';
import { ConfigsContext } from 'context/ConfigsContext';
import useMachineService from 'services/machineService';
import { AuthContext } from 'context/AuthContext';
import EDITPERQUART from './EDITPERQUART';
import ADDRENS from './AddRens';
// import ADDRENS from './addRens';

export default function EditOf({ data, close }) {
  let [correctionData, setCorrectionData] = useState({});
  const { decodedToken, token, user } = useContext(AuthContext);
  const [initialData, setInitialData] = useState({});
  const [pb, setPb] = useState(0);
  const [prb, setPrb] = useState(0);
  const [pret, setPret] = useState(0);
  const [pADQ, setPADQ] = useState(0);
  const [ofData, setOfData] = useState({});
  const [machine, setMachine] = useState({});
  let [correctionPerQuart, setCorrectionPerQuart] = useState([]);
  const [quart, setQuart] = useState('');
  const theme = useTheme();
  const { getCorrectionData, editOF, getOFById, getAllOfByMachine } = useOfService();
  const { getUser } = useUserService();
  const { getAllMachines } = useMachineService();
  // Use effect
  useEffect(async () => {
    const of = await getOFById(data.of);
    console.log('offfffff', of.data);
    setOfData(of.data.fabricationOrder);
    const cd = await getCorrectionData({
      of: data.of,
      machine: data.machine,
    });
    const mach = await getAllMachines();
    console.log(mach?.find((p) => p.id === data.machine)?.code);
    setMachine(mach?.find((p) => p.id === data.machine)?.code);
    // const quartCode =
    //   data.quartCode.slice(0, data.quartCode.length - 8) +
    //   ' ' +
    //   data.quartCode.slice(data.quartCode.length - 8, data.quartCode.length - 6) +
    //   '/' +
    //   data.quartCode.slice(data.quartCode.length - 6, data.quartCode.length - 4) +
    //   '/' +
    //   data.quartCode.slice(data.quartCode.length - 4, data.quartCode.length + 1);
    // setQuart(quartCode);
    // console.log(cd);
    correctionPerQuart = cd;
    console.log('cd', data);
    setCorrectionPerQuart(correctionPerQuart);
    setInitialData(data);
    setPb(Number(correctionData.pbonnes));
    setPrb(Number(correctionData.prebutes));
    setPret(Number(correctionData.pretouche));
    setPADQ(Number(correctionData.pattenteDQ));
    console.log('dataaaaaaa', data);
  }, []);
  //   useEffect(async () => {
  //     const user = JSON.parse(sessionStorage.getItem('session'));
  //     console.log(user);
  //     console.log('dataaaaaaa', data);
  //     const of = await getOFById(data.of);
  //     console.log('offfffff', data);
  //   }, []);
  return (
    // <Stack direction="row" spacing={1} margin={1}>
    <>
      {correctionPerQuart.map((corr) => {
        return (
          <EDITPERQUART
            data={data}
            correctionData={corr.data}
            quart={corr.quart}
            close={close}
            ofData={ofData}
            user={user}
            machine={machine}
          />
        );
      })}
    </>
    // </Stack>
  );
}
