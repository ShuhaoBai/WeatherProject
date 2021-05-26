import React from 'react';
import { Theme, createStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IPrecipStationResults } from '../models/PrecipStation';
import TablePaginationActions from './table-core/TablePaginationActions';

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      width: '100%',
    },
  })
)(TableCell);

export interface INewSingleTableProps {
  singleTableResults: IPrecipStationResults[];
}
export interface INewSingleTableState {
  page: number;
  rowsPerPage: number;
}

class NewSingleTable extends React.Component<
  INewSingleTableProps,
  INewSingleTableState
> {
  constructor(props: INewSingleTableProps) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
    };
  }
  handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    this.setState({
      page: newPage,
    });
  };
  handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };
  render() {
    const { singleTableResults } = this.props;
    const { page, rowsPerPage } = this.state;
    if (!singleTableResults) {
      return (
        <div>
          <h1>No data available for this station...</h1>
        </div>
      );
    } else {
      const emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, singleTableResults.length - page * rowsPerPage);
      return (
        <TableContainer component={Paper}>
          <Table aria-label="weather station information detail table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" align="left">
                  Date
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="left">
                  DataType
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="left">
                  Station ID
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="left">
                  Attributes
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="left">
                  Value
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? singleTableResults.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : singleTableResults
              ).map((result, idx) => (
                <StyledTableRow key={idx}>
                  <TableCell component="th" scope="row">
                    {result.date}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {result.datatype}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {result.station}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {result.attributes}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {result.value}
                  </TableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={singleTableResults.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={(event, newPage) =>
                    this.handleChangePage(event, newPage)
                  }
                  onChangeRowsPerPage={(event) =>
                    this.handleChangeRowsPerPage(event)
                  }
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      );
    }
  }
}

export default NewSingleTable;
