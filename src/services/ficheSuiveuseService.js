import useHttpClient from '../hooks/useHttpClient';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ConfigsContext } from 'context/ConfigsContext';

const useFicheSuiveuseService = () => {
  const { sendRequest } = useHttpClient();
  const { setFicheSuiveuseConfigs } = useContext(ConfigsContext);

  const getConfigs = async (modelId) => {
    try {
      const response = await sendRequest('configs');
      const modelMachine = await sendRequest('configs/model/' + modelId);
      const modelCauses = modelMachine.data.model.causes;

      const activeConfigs = [];
      response.data.configs.forEach((config) => {
        const c = [];
        const categories = config.categories.filter((category) => category.isActive === true);

        categories.map((category) => {
          const causes = category.causes.filter((cause) => cause.isActive === true);
          const causesFiltred = causes.filter((cause) => {
            if (cause.isGeneric) return cause;
            if (modelCauses.includes(cause.id)) return cause;
          });
          if (causesFiltred.length > 0 || category.isSelected === true) {
            category.causes = causesFiltred;
            c.push(category);
          }
        });
        config.categories = c;
        activeConfigs.push(config);
      });
      setFicheSuiveuseConfigs([...activeConfigs]);
    } catch (error) {
      // toast.error('error')
    }
  };

  const getMachineStatus = async (id, date, quart) => {
    try {
      const response = await sendRequest(`responsable/machines/status/${id}`, 'post', { date, quart });
      return response.data.machineStatusHistoryData;
    } catch (error) {
      //   toast.error('error')
    }
  };

  const getAllMachnesStatus = async () => {
    try {
      const response = await sendRequest(`responsable/machines/status`);
      if (response.data.machinesStatus) return response.data.machinesStatus;
      return [];
    } catch (error) {
      return [];
    }
  };

  const addReworkRejectMachineStatus = async (data) => {
    try {
      data.machineCode = JSON.parse(sessionStorage.getItem('machine')).id;
      await sendRequest('machines/rework/reject', 'post', { data });
      await getMachineStatus();
    } catch (error) {
      console.log(error);
      //toast.error('error in reject rework')
    }
  };

  const addMachineStatus = async (data) => {
    try {
      const response = await sendRequest(
        'machines/status/' + JSON.parse(sessionStorage.getItem('machine'))?.id,
        'post',
        data,
      );
      if (response) {
        toast.success('opération effectuee avec succès');
        return true;
      }
    } catch (error) {
      // toast.error('error ')
    }
  };

  const editMachineStatus = async (data, callBack) => {
    try {
      const response = await sendRequest(
        'machines/status/' + JSON.parse(sessionStorage.getItem('machine'))?.id,
        'put',
        data,
      );
      if (response) {
        toast.success('opération effectuee avec succès');
        getMachineStatus();
        callBack();
      }
    } catch (error) {
      // toast.error('error')
    }
  };

  const editCurrentMachineStatus = async (date) => {
    try {
      const response = await sendRequest(
        'machines/current/status/' + JSON.parse(sessionStorage.getItem('machine'))?.id,
        'put',
        { date },
      );
      if (response) {
        getMachineStatus();
      }
    } catch (error) {
      //toast.error('error')
    }
  };

  const editMachineStatusData = async (data, callBack) => {
    try {
      const response = await sendRequest('responsable/machines/status/', 'put', { data });
      if (response) {
        callBack();
      }
    } catch (error) {
      // toast.error('error')
    }
  };

  const getCurrentQuart = async () => {
    try {
      const response = await sendRequest('current/quartdata');
      return response.data;
    } catch (error) {
      //toast.error('error')
    }
  };

  const getTrgValue = async (data) => {
    console.log(data);
    try {
      const response = await sendRequest('trgvalue', 'post', data);
      if (response.status === 200) {
        // toast.success("Trg A jour");
        return response.data.value;
      }
    } catch (error) {
      //toast.error('Erreur lors de cloture');
    }
  };

  const getNonTrgValue = async (data) => {
    console.log(data);
    try {
      const response = await sendRequest('nonTrgValue', 'post', data);
      if (response.status === 200) {
        console.log('response', response);
        return response.data.value;
      }
    } catch (error) {
      //toast.error('Erreur lors de cloture');
    }
  };

  const testInCoherence = async (data) => {
    try {
      const response = await sendRequest('incoherence-test', 'post', data);
      if (response.data.status === 201) {
        return response.data.testIncoherence;
      }
    } catch (error) {
      toast.error('Erreur lors de cloture');
    }
  };

  const getcoherence = async (id) => {
    try {
      const res = await sendRequest('cycleMachine/taux/' + id, 'get');
      return res.data.response;
    } catch (error) {
      toast.error('error');
    }
  };
  const correctionReworkRejectMachineStatus = async (data) => {
    try {
      // data.machineId = JSON.parse(sessionStorage.getItem('machine')).id;
      await sendRequest('machines/rework/reject', 'put', { data });
      // await getMachineStatus();
    } catch (error) {
      console.log(error);
      toast.error('error in reject rework');
    }
  };

  return {
    getMachineStatus,
    addMachineStatus,
    editMachineStatus,
    editCurrentMachineStatus,
    addReworkRejectMachineStatus,
    getConfigs,
    getCurrentQuart,
    getAllMachnesStatus,
    getTrgValue,
    testInCoherence,
    getNonTrgValue,
    getcoherence,
    editMachineStatusData,
    correctionReworkRejectMachineStatus,
  };
};

export default useFicheSuiveuseService;
