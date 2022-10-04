import useHttpClient from 'hooks/useHttpClient';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const useMachineCycleService = () => {
  const { t, i18n } = useTranslation();

  const { sendRequest } = useHttpClient();

  const addCycle = async (cycle) => {
    console.log('addd');
    const response = await sendRequest('cycleMachine', 'post', cycle);
    if (response) {
      console.log(response);
      return response;
    }
  };
  const getAllCycle = async () => {
    const response = await sendRequest('cycleMachine', 'get');
    if (response) {
      console.log(response);
      return response;
    }
  };
  const editCycle = async (data) => {
    const response = await sendRequest('cycleMachine', 'put', data);
    return response;
  };

  const deleteCycle = async (id) => {
    const response = await sendRequest('cycleMachine/' + id, 'delete');
    if (response.status === 201) toast.warning(t('MACHINE_CYCLE.TOAST.CODE_USED'));
    else if (response.status === 200) {
      toast.success(t('MACHINE_CYCLE.TOAST.DELETE_SUCCESS'));
      window.location.reload(false);
    } else toast.error(t('MACHINE_CYCLE.TOAST.ERROR_DELETE'));
    return response;
  };
  return { addCycle, getAllCycle, editCycle, deleteCycle };
};

export default useMachineCycleService;
