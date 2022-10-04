import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import useMappingService from 'services/mappingService';
import { Button, Stack } from '@material-ui/core';
import { Box } from '@material-ui/system';
import getpath from './getpath';

const MachineTree = ({ setLigneModal, setSitePath, setSite, setSiteValeurObjectif }) => {
  const { getAllMapping } = useMappingService();
  //id e local 0 par defaut vide
  const [localId, setLocalId] = React.useState(0);
  const [objectif, setObjectif] = React.useState(0);
  const [data, setData] = React.useState([]);
  async function mappingList() {
    const mappingData = await getAllMapping();
    const data = {
      id: 'root',
      name: 'STELIA',
      value: mappingData.data.mapping,
    };
    setData(data);
  }
  React.useEffect(() => {
    mappingList();
  }, []);
  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      color="error"
      onClick={() => {
        if (nodes.objectif && nodes.objectif?.length !== 0) {
          setObjectif(nodes.objectif);
          setLocalId(nodes.id);
        } else {
          setLocalId(0);
        }
      }}
    >
      {Array.isArray(nodes.value) ? nodes.value.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(data)}
      </TreeView>
      <Stack direction="row" alignItems="end" justifyContent="end" margin={2}>
        <Box
          sx={{
            '& button': { m: 1 },
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button
            color="error"
            variant="contained"
            fullWidth
            onClick={() => {
              setLigneModal(false);
            }}
          >
            annuler
          </Button>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={localId === 0}
            onClick={() => {
              setSite(localId);
              setSitePath(getpath(data.value, localId));
              setLigneModal(false);
              setSiteValeurObjectif(objectif);
            }}
          >
            confirmé
          </Button>
        </Box>
      </Stack>
    </>
  );
};
export default MachineTree;
