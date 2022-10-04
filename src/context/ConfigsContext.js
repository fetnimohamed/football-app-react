import React, { useState } from 'react';

export const ConfigsContext = React.createContext();

const ConfigsProvider = (props) => {
  const [configs, setConfigs] = useState([]);
  const [models, setModels] = useState([]);
  const [processTypes, setProcessTypes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [machines, setMachines] = useState([]);

  // fiche suiveuse part
  const [ficheSuiveuseConfigs, setFicheSuiveuseConfigs] = useState([]);

  const AddUser = (config) => setConfigs([...configs, config]);

  return (
    <ConfigsContext.Provider
      value={{
        configs,
        setConfigs,
        models,
        setModels,
        processTypes,
        setProcessTypes,
        articles,
        setArticles,
        machines,
        setMachines,
        ficheSuiveuseConfigs,
        setFicheSuiveuseConfigs,
      }}
    >
      <>{props.children}</>
    </ConfigsContext.Provider>
  );
};

export default ConfigsProvider;
