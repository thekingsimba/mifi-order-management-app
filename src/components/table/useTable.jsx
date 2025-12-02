import { useCallback, useEffect, useState } from 'react';

export default function useTable(props) {
  const [dense, setDense] = useState(!!props?.defaultDense);

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

  const [order, setOrder] = useState(props?.defaultOrder || 'asc');

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [rowsPerPage, setRowsPerPage] = useState(
    props?.defaultRowsPerPage || 10
  );

  const [selected, setSelected] = useState(props?.defaultSelected || []);

  const onSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === 'asc';
      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const onChangePage = useCallback((_event, newPage) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);
  useEffect(() => {
    if(page*rowsPerPage+rowsPerPage>=props.dataLength){
      setPage(0);
     }
  },[props.dataLength])



  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,
    //
    selected,

    setPage,
    setDense,
    setOrder,
    setOrderBy,
    setSelected,
    setRowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  };
}
