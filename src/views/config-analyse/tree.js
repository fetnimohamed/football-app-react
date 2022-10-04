import { Paper, TableContainer, Grid } from '@material-ui/core';
import { TreeItem, TreeView } from '@mui/lab';
import React from 'react';
import useMachineService from 'services/machineService';
import useMappingService from 'services/mappingService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CheckBox } from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';
import { node, string } from 'prop-types';
import { Box } from '@material-ui/system';

const Tree = ({ setLocal, setOpen, setLocalPath, machineData, setMachinesArray, machinesArray }) => {
  const { getAllMapping } = useMappingService();

  //id e local 0 par defaut vide
  const [localId, setLocalId] = React.useState(0);
  const [data, setData] = React.useState([]);
  async function mappingList() {
    const mappingData = await getAllMapping();
    console.log(mappingData);
    console.log('machineData', machineData);
    const data = {
      id: 'root',
      name: 'STELIA',
      value: mappingData?.data?.mapping,
    };
    setData(data);
  }
  React.useEffect(() => {
    console.log(machineData);
    mappingList();
  }, []);
  const renderTree = (nodes) => {
    return (
      <Grid container direction="row" justifyContent="start">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={nodes.name}
            color="error"
            onClick={() => {
              nodes?.value.length !== 0 ? setLocalId(0) : setLocalId(nodes.id);
            }}
          >
            {Array.isArray(nodes.value)
              ? nodes.value.map((node) => {
                  if (node.value.length > 0) {
                    //return  <h2>{renderTree(node)}</h2>
                  } else {
                    machineData?.map((res) => {
                      if (res.local === node.id) {
                        node.value.push({
                          ...node.value,
                          id: res?.id,
                          name: res?.code,
                          value: [],
                        });
                      } else {
                        node.value = [];
                      }
                    });
                  }
                  return <h2>{renderTree(node)}</h2>;
                })
              : null}
          </TreeItem>
          {nodes?.value?.length === 0 ? (
            <Checkbox
              checked={machinesArray.indexOf(nodes.id) != -1}
              onChange={() => {
                if (machinesArray.indexOf(nodes.id) === -1) {
                  setMachinesArray([...machinesArray, nodes.id]);
                } else {
                  const newData = machinesArray.filter((ar) => ar !== nodes.id);
                  setMachinesArray(newData);
                }
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Box>

        {/* <Grid sx={{}} >
                    {nodes?.value?.length == 0 ?
                        <Checkbox
                            checked={machinesArray.indexOf((nodes.id)) != -1}
                            onChange={() => {
                                if (machinesArray.indexOf((nodes.id)) === -1) { setMachinesArray([...machinesArray, nodes.id]) }
                                else {
                                    const newData = machinesArray.filter(ar => ar !== nodes.id)
                                    setMachinesArray(newData)
                                }
                            }
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                        /> :
                        ''}
                </Grid> */}
      </Grid>
    );
  };
  return (
    <>
      <TableContainer sx={{ width: '100%', padding: '20px', margin: '15px' }} component={Paper}>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={['root']}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {renderTree(data)}
        </TreeView>
      </TableContainer>
    </>
  );
};
export default Tree;
