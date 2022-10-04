import React, { useEffect, useState } from 'react';

import { useContext } from 'react';
import { ConfigsContext } from 'context/ConfigsContext';
import useMachineService from '../../services/machineService';

import MainCard from 'ui-component/cards/MainCard';

import useMappingService from 'services/mappingService';

import Grid from '@mui/material/Grid';

import { v4 as uuidv4 } from 'uuid';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { Modal, Box, Typography, IconButton, TextField, Stack, Button } from '@mui/material';

import EditMappingValue from './editMappingValue';
import AddMapping from './addMapping';

// TREE STYLING
// TREE STYLING
// TREE STYLING

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';

import { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs';
import { toast } from 'react-toastify';

// MODAL
// import Modal from 'ui-component/modal/modal';

// TREE STYLING
// TREE STYLING
// TREE STYLING

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} />)(
  ({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }),
);

// SINGLE TREE NODE -- RECURSIVE FUNCTION
// SINGLE TREE NODE -- RECURSIVE FUNCTION
// SINGLE TREE NODE -- RECURSIVE FUNCTION

const MappingTreeView = ({ data, setEditNodeModal, setAddNodeModal, levels, deleteMappingById }) => {
  const renderTree = (nodes, i) => (
    <>
      <Grid container direction="row" justifyContent="start" alignItems="baseline">
        <Grid item>
          <StyledTreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name + ' (niveau ' + i + ' )    '}>
            {Array.isArray(nodes.value) ? nodes.value.map((node) => renderTree(node, i + 1)) : null}
          </StyledTreeItem>
        </Grid>
        <Grid item>
          {i !== 0 && (
            <IconButton
              onClick={() => {
                console.log('clicked ', nodes.id);

                setEditNodeModal(nodes);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>

        <Grid item>
          {i < levels?.length - 1 && (
            <IconButton
              onClick={() => {
                console.log('clicked ', nodes.id);
                // we will assign the object (node clicked) with the it's level to modal(add modal)
                const obj = Object.assign({}, nodes, { i });
                setAddNodeModal(obj);
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>

        <Grid item>
          {nodes?.value.length === 0 && (
            <IconButton
              onClick={() => {
                console.log('clicked ', nodes.id);
                deleteMappingById(nodes.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </>
  );

  return (
    <TreeView
      aria-label="multi-select"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        height: '100%',
        flexGrow: 1,
        maxWidth: '100%',
        overflowY: 'auto',
        alignItems: 'center',
      }}
    >
      {data && renderTree(data, 0)}
    </TreeView>
  );
};

// ALL THE TREE

const MappingTree = () => {
  const [editNodeModal, setEditNodeModal] = useState(false);

  const [addNodeModal, setAddNodeModal] = useState(false);

  const { getAllMapping, postMappingTree } = useMappingService();
  const { getAllMachines } = useMachineService();

  const [levels, setLevels] = useState([]);

  const [data, setData] = useState([]);

  const [relod, setRelod] = useState(false);
  // GET ALL DATA
  const fetchMapping = async () => {
    const response = await getAllMapping();
    if (response?.data) {
      if (response.data?.niveau) {
        let newArray = [...response.data.niveau];
        newArray.unshift('STELIA');
        console.log(newArray, 'mapping to parse');
        setLevels(newArray);
      }

      if (response?.data?.mapping) setData({ id: 'root', name: 'STELIA', value: response.data.mapping });
    }
  };

  useEffect(() => {
    fetchMapping();
    getAllMachines();
  }, []);

  useEffect(() => {
    if (relod) fetchMapping();
    return () => setRelod(false);
  }, [relod]);

  //RECURSIVE FUNCTION TO MODIFY THE SELECTED ARRAY
  const modifyNewArray = (id, newArray, newName, designation, objectif = '', position = 400) => {
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].id === id) {
        newArray[i].name = newName;
        newArray[i].designation = designation;
        newArray[i].objectif = objectif;
        newArray[i].position = position;
        return;
      } else {
        modifyNewArray(id, newArray[i].value, newName, designation, objectif, position);
      }
    }
  };

  // EDIT SELECT NODE BY IT'S ID
  const editMappingNameById = (id, newName, designation, objectif, position) => {
    //if (!check_exist(data, newName)) {
    const newArray = [...data.value];
    modifyNewArray(id, newArray, newName, designation, objectif, position);
    toast.success('Votre modification a été enregistré !');
    setData({ id: 'root', name: 'STELIA', value: newArray });
    //  } else {
    //toast.error('this mapping code is already existant');
    //}
  };

  // RECURSIVE FUNCTION TO ADD A NODE
  const addNewArray = (id, name, designation, objectif = '', newArray) => {
    for (let i = 0; i < newArray?.length; i++) {
      if (newArray[i].id === id) {
        newArray[i].value.push({ id: uuidv4(), name, designation, objectif, value: [] });
        return;
      } else {
        addNewArray(id, name, designation, objectif, newArray[i].value);
      }
    }
  };
  const mapTreeToArray = (treeData, i, arr) => {
    if (treeData)
      treeData.map((item) => {
        arr.push({
          niveau: i,
          name: item.name,
          id: item.id,
        });
        mapTreeToArray(item.value, i + 1, arr);
      });
  };

  // check if there is same code mapping under same level
  function check_exist(data, matchCode /*, level*/) {
    let exist = false;
    const arr = [];
    mapTreeToArray(data?.value, 1, arr);
    arr.forEach((node) => {
      if (node.name === matchCode /*&& node.level === level*/) {
        exist = true;
        return exist;
      }
    });
    return exist;
  }
  // search end

  // ADD NODE TO THE SELECTED NODE
  const addMappingToId = (id, name, designation, objectif = '', position = 200) => {
    if (!id || !name || !designation) {
      toast.error('données invalide');
      return;
    }
    const newArray = [...data.value];
    // here we check
    console.log(check_exist(data, name), 'here we check');
    if (!check_exist(data, name)) {
      if (id === 'root') {
        newArray.push({ id: uuidv4(), name, designation, objectif, position, value: [] });
      } else addNewArray(id, name, designation, objectif, position, newArray);
      setData({ id: 'root', name: 'STELIA', value: newArray });
    } else {
      toast.error('this mapping code is already existant');
    }
  };

  // RECURSIVE FUNCTION TO DELETE FROM THE ARRAY
  const deleteFromArray = (id, newArray) => {
    for (let i = 0; i < newArray?.length; i++) {
      if (newArray[i].id === id) {
        newArray.splice(i, 1);
        return;
      } else {
        deleteFromArray(id, newArray[i].value);
      }
    }
  };

  const { machines } = useContext(ConfigsContext);

  // DELETE FROM THE DATA BY ID
  const deleteMappingById = (id) => {
    const machinesWithThisSite = machines.filter((machine) => machine.local === id);
    if (machinesWithThisSite.length !== 0) {
      toast.error('un machine existe dans ce site');
      return false;
    }
    const newArray = [...data.value];

    deleteFromArray(id, newArray);

    setData({ id: 'root', name: 'STELIA', value: newArray });
  };

  return (
    <MainCard title="Arborescence Mapping" style={{ marginTop: '100px', height: '400px', paddingTop: '20px' }}>
      {data && data.length !== 0 && (
        <MappingTreeView
          data={data}
          EditNodeModal={editNodeModal}
          setEditNodeModal={setEditNodeModal}
          setAddNodeModal={setAddNodeModal}
          levels={levels}
          deleteMappingById={deleteMappingById}
        />
      )}

      <Modal
        title={'Editer le libelle de ' + editNodeModal.name}
        open={editNodeModal}
        onClose={() => setEditNodeModal(false)}
      >
        <EditMappingValue
          editNodeModal={editNodeModal}
          setEditNodeModal={setEditNodeModal}
          data={data}
          editMappingNameById={editMappingNameById}
        />
      </Modal>

      <Modal title={'ajouter un site '} open={addNodeModal} onClose={() => setAddNodeModal(false)}>
        <AddMapping
          addNodeModal={addNodeModal}
          setAddNodeModal={setAddNodeModal}
          treeData={data}
          addMappingToId={addMappingToId}
          levels={levels}
        />
      </Modal>

      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        spacing={2}
        style={{ marginTop: '50px' }}
      >
        <Grid item>
          <h4> les changements n'auront pas lieu qu'apres la confirmation </h4>
        </Grid>
      </Grid>

      <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              postMappingTree(data.value);
              console.log(data.value);
            }}
          >
            Confirmer
          </Button>
        </Grid>
        <Grid item>
          <Button color="error" variant="contained" onClick={() => setRelod(true)}>
            Annuler
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default MappingTree;
