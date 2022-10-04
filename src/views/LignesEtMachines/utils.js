// convert tree to array
export function mapTreeToArray(treeData, i, arr) {
  if (treeData)
    treeData.map((item) => {
      arr.push({
        niveau: i,
        name: item.name,
        id: item.id,
      });
      mapTreeToArray(item.value, i + 1, arr);
    });
}

// find row name
export function getRowName(array, id) {
  if (array.length === 0) return '';
  return array.find((ar) => ar.id === id).name;
}
export function getPosition(array, id) {
  if (array.length === 0) return '';

  console.log('position', getpos(array, id));
  if (getpos(array, id) != null) return getpos(array, id);
  return 0;
}
const getpos = (node, id) => {
  // console.log("node", node, id);
  for (const n of node) {
    // console.log("dddd", n.id,id);
    if (n.id === id) {
      console.log('result', n);
      return n.position;
    } else {
      const result = getpos(n.value, id);
      console.log('resultjj', result);
      if (result != null) return result;
    }
  }
  return null;
};

//get all rows from an array
export function getAllRows(array, mapping) {
  const rows = [];
  array.map((ar) => {
    console.log({ ar });
    const index = rows.findIndex((el) => el.local === ar.local);
    console.log('index', index);
    if (index === -1) {
      console.log('bozz', getPosition(mapping, ar.local));
      rows.push({ local: ar.local, position: Number(getPosition(mapping, ar.local)) });
    }
  });

  const data = rows.sort(sortPos);
  console.log('1212row', rows);

  return data.map((row) => row.local);
}
const sortPos = (a, b) => {
  if (Number(b.position) < Number(a.position)) {
    return 1;
  } else {
    return -1;
  }
};

// get machines of row
export function getRowMachines(array, localId) {
  console.log('rowrowrow', array.filter((ar) => ar.local === localId).sort(sortPos));
  return array.filter((ar) => ar.local === localId).sort(sortPos);
}

// get machine background depend on the status
export function getBgDependOnStatus(array, machineId) {
  const index = array.findIndex((ar) => ar.machineId === machineId);
  if (index === -1) return '#FF5454';
  return array[index].status ? '#70DC5F' : '#FF5454';
}
