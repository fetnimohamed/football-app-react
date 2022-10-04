import React, { useContext, useEffect, useState } from 'react';
import { IconEye } from '@tabler/icons';
import Modal from 'ui-component/modal/modal';
import useProcessTypeService from 'services/processTypeService';
import { ConfigsContext } from 'context/ConfigsContext';
import useArticlesService from 'services/articlesService';
import VersionsTable from './VersionsTable';
import { Button, IconButton, TextField } from '@material-ui/core';
import moment from 'moment';
import { DataGrid, GridSearchIcon } from '@material-ui/data-grid';
import OvertureMachine from 'views/overtureMachine';
import ClearIcon from '@mui/icons-material/Clear';
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const defaultTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
        },
        border: `1px solid ${theme.palette.divider}`,
        margin: theme.spacing(2, 2, 1.5),
        padding: theme.spacing(2, 2, 1.5),
        borderRadius: 10,
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
          display: 'none',
        },
      },
    }),
  { defaultTheme },
);
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Rechercher"
        className={classes.textField}
        InputProps={{
          startAdornment: <GridSearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
export default function Articles() {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [processType, setProcessType] = useState('');
  const [articleSelected, setArticleSelected] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);
  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllArticles } = useArticlesService();
  const { processTypes, articles } = useContext(ConfigsContext);
  const [pageSize, setPageSize] = React.useState(25);
  const columns = [
    { field: 'code', headerName: 'Code article', width: 300 },
    { field: 'article', headerName: 'Article', width: 300 },
    { field: 'machine', headerName: 'Machine', width: 300 },
    {
      field: 'T.Cycle',
      headerName: 'T.Cycle',
      sortable: true,
      width: 500,
      valueGetter: (params) => `${params.row.timeCycles[params.row?.timeCycles?.length - 1].value}`,
    },
    {
      field: 'Détails',
      headerName: '',
      sortable: false,
      width: 200,
      renderCell: (params) => <IconEye onClick={() => openModal(params.row)} />,
    },
  ];

  const openModal = (details) => {
    setOpenDetailsModal(true);
    setArticleSelected(details);
  };

  const closeModal = () => {
    setOpenDetailsModal(false);
    setArticleSelected(null);
  };

  useEffect(() => {
    getAllProcessTypes();
    getAllArticles(setRows);
  }, []);

  const requestSearch = (searchValue) => {
    if (searchValue) {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = articles.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      setRows(filteredRows);
    } else {
      setRows(articles);
    }
  };
  return (
    <>
      <select
        style={{ margin: 20, padding: 5 }}
        onChange={(e) => {
          setProcessType(e.target.value);
          setRows([...articles.filter((a) => a.processTypeId === processType)]);
        }}
      >
        <option value="">Tous les types de process</option>
        {processTypes.map((p) => (
          <option value={p.id}>{p.designation}</option>
        ))}
      </select>

      {/* Articles Data */}
      <div style={{ height: '500px', width: '100%', background: '#fff' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu={true}
          components={{ Toolbar: QuickSearchToolbar }}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[25, 50, 100]}
          pagination
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => {
                requestSearch(event.target.value);
                setSearchText(event.target.value);
              },
              clearSearch: () => {
                setSearchText('');
                getAllArticles(setRows);
              },
            },
          }}
          //  rowsPerPageOptions={[10, 20, 30, 50, 100, 1000, 10000]}
        />
      </div>

      {/* Deatils Modal */}
      <Modal title="Articles Details" open={openDetailsModal} close={closeModal}>
        <div style={{ padding: 10 }}>
          <TextField
            label="Code article"
            value={articleSelected?.articleCode}
            disabled={true}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <TextField
            label="Désignation"
            value={articleSelected?.article}
            disabled={true}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <TextField
            label="Machine"
            value={articleSelected?.machine}
            disabled={true}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <TextField
            label="Code"
            value={articleSelected?.code}
            disabled={true}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <TextField
            label="T.Cycle courant"
            value={articleSelected ? articleSelected?.timeCycles[articleSelected?.timeCycles?.length - 1]?.value : ''}
            disabled={true}
            style={{ width: '100%', marginBottom: 5 }}
          />
          <VersionsTable
            data={articleSelected?.timeCycles?.map((art, i) => ({
              id: i,
              v: i + 1,
              value: art.value,
              date: moment(art.date).format('DD-MM-YYYY'),
            }))}
          />
          <Button color="error" style={{ margin: 5 }} variant="contained" size="medium" onClick={closeModal}>
            Retour
          </Button>
        </div>
      </Modal>
    </>
  );
}
