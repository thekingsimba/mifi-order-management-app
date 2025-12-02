import { styled } from "@mui/material/styles"
import { TableCell, Paper, TableContainer } from "@mui/material"

export const TableWrapper = styled(Paper)(()=>({
 width: "100%",
  overflow: "hidden",
}))

export const CustomTableContainer = styled(TableContainer)(() => ({
  borderTopLeftRadius: '0.5rem',
  borderTopRightRadius: '0.5rem',
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: '80vh',
}));

export const HeaderCell = styled(TableCell)(()=>({
 textAlign: "left",
  backgroundColor: "#e8e8e8",
  fontWeight:"bold",
}))












export const CustomTableStyles = () => ({
 tableWrapper: {
  width: "100%",
  overflow: "hidden",
 },

 table: {
  borderTopLeftRadius: "0.5rem",
  borderTopRightRadius: "0.5rem",
  overflowX: "hidden",
  overflowY: "auto",
  maxHeight:"80vh"
 },

 headerCell: {
  textAlign: "left",
  backgroundColor: "#e8e8e8",
  fontWeight:"bold",
 },

 headerRow: {
  backgroundColor: "#e8e8e8",
  fontWeight:"bold",
 },

})