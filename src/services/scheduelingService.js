import useHttpClient from 'hooks/useHttpClient';

const useScheduleExtractionService = () => {
  const { sendRequest } = useHttpClient();

  const addSchedule = async (extraction) => {
    const response = await sendRequest('schedule/', 'post', extraction);
    console.log('response', response);
    if (response) {
      return response;
    }
  };

  const getSchedulebyprocessType = async (processType) => {
    console.log('loading');

    const url = 'schedule/' + processType;

    const response = await sendRequest(url, 'get');
    if (response) {
      return response;
    }
  };
  const editSchedule = async (data) => {
    const response = await sendRequest('schedule/', 'put', data);
    if (response) {
      return response;
    }
  };

  return {
    addSchedule,
    editSchedule,
    getSchedulebyprocessType,
  };
};
export default useScheduleExtractionService;
