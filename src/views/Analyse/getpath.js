const getpath = (node, id) => {
  // console.log("node", node, id);
  for (const n of node) {
    // console.log("dddd", n.id,id);
    if (n.id === id) {
      return n.name;
    } else {
      let result = getpath(n.value, id);
      // console.log('result',result);
      if (result) {
        return n.name + '/' + result;
      }
    }
  }
  return null;
};
export default getpath;
