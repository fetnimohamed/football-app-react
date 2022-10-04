import React from 'react';

import Select from 'react-select';

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    zIndex: 4000,
  }),
};

export default ({ data, onChange }) => (
  <Select
    closeMenuOnSelect={false}
    defaultValue={[]}
    isMulti
    options={data}
    onChange={onChange}
    styles={customStyles}
  />
);
