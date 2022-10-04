import * as React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
// web.cjs is required for IE11 support
import { useSpring, animated } from 'react-spring/web.cjs';

import Grid from '@mui/material/Grid';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { toast } from 'react-toastify';

//import {MinusSquare, CloseSquare, PlusSquare, } from './icons'

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

export default function CustomizedTreeView({
  data,
  openCategoryModal,
  openCategoryDeleteModal,
  openCauseModal,
  openCauseDeleteModal,
}) {
  return (
    <TreeView
      aria-label="customized"
      defaultExpanded={['1']}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultEndIcon={<ChevronRightIcon />}
      sx={{
        height: '100%',
        flexGrow: 2,
        maxWidth: '100%',
        overflowY: 'auto',
        alignItems: 'center',
      }}
    >
      {data.map((d) => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <StyledTreeItem nodeId={d.id} label={d.label}>
                {d?.categories?.map((category) => (
                  <Grid container spacing={1} style={{ bordxer: '1px solid ', margin: '3px' }}>
                    <Grid item xs={6}>
                      <StyledTreeItem nodeId={category.id} label={category.designation}>
                        {category?.causes?.map((cause) => {
                          return (
                            <Grid container spacing={1} style={{ bordxer: '1px solid ', margin: '3px' }}>
                              <Grid item xs={6}>
                                <StyledTreeItem nodeId={cause.id} label={cause.designation} />
                              </Grid>

                              <Grid item xs={1}>
                                <IconPencil onClick={() => openCauseModal(d.id, category.id, cause)} />
                              </Grid>

                              <Grid item xs={1}>
                                <IconTrash onClick={() => openCauseDeleteModal(d.id, category.id, cause.id)} />
                              </Grid>
                            </Grid>
                          );
                        })}
                      </StyledTreeItem>
                    </Grid>
                    <Grid item xs={1}>
                      <IconPlus onClick={() => openCauseModal(d.id, category.id)} />
                    </Grid>
                    <Grid item xs={1}>
                      {d.id !== -1 && <IconPencil onClick={() => openCategoryModal(d.id, category)} />}
                    </Grid>
                    <Grid item xs={1}>
                      {d.id !== 6 && (
                        <IconTrash
                          onClick={() => {
                            if (category?.causes?.length > 0)
                              return toast.error('des cause sont associé à cette catéguory');
                            openCategoryDeleteModal(category.id, d.id);
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                ))}
              </StyledTreeItem>
            </Grid>
            <Grid item xs={2} style={{ margin: d.id === 6 ? 0.5 : 0 }}>
              {d.id !== 6 && <IconPlus onClick={() => openCategoryModal(d.id, false)} />}
            </Grid>
          </Grid>
        );
      })}
    </TreeView>
  );
}

//Icons

export function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

export function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

export function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}
