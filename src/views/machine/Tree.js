import { Paper, TableContainer } from '@material-ui/core';
import { TreeItem, TreeView } from '@mui/lab';
import React from 'react';
import useMachineService from 'services/machineService';
import useMappingService from 'services/mappingService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CheckBox } from '@mui/icons-material';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { makeStyles } from '@material-ui/styles';
const Tree = ({ setLocal, setOpen, setLocalPath, machineData }) => {
  const { getAllMapping } = useMappingService();
  const useStyles = makeStyles({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 400,
      color: 'black',
      fontWeight: 'bolder',
    },
  });

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
    mappingList();
  }, []);
  const classes = useStyles();
  const renderTree = (nodes) => {
    return (
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
              if (node.value?.length > 0) {
                //return  <h2>{renderTree(node)}</h2>
              } else {
                if (machineData?.filter((mach) => mach.local === node.id)[0]?.id) {
                  machineData
                    ?.filter((mach) => mach.local === node.id)
                    .map((m, i) => {
                      node.value.push({
                        id: machineData?.filter((mach) => mach.local === node.id)[i]?.id,
                        name: machineData?.filter((mach) => mach.local === node.id)[i]?.code,
                        value: [],
                      });
                    });
                } else {
                  node.value = [];
                }
              }
              console.log('nde', node.value);
              return <h2>{renderTree(node)}</h2>;
            })
          : null}
      </TreeItem>
    );
  };
  return (
    <>
      <TableContainer sx={{ height: '500px', width: '100%', fontWeight: 'bold', m: 1 }} component={Paper}>
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={['root']}
          defaultExpandIcon={<ChevronRightIcon />}
          className={classes.root}
        >
          {renderTree(data)}
        </TreeView>
      </TableContainer>
    </>
  );
};
export default Tree;
