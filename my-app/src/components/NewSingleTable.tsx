import React from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
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

const styles = ({ palette }: Theme) =>
  createStyles({
    headerCell: {
      backgroundColor: palette.common.black,
      color: palette.common.white,
      fontSize: 16,
      width: '100%',
    },
    tableRow: {
      '&:nth-of-type(odd)': {
        backgroundColor: palette.action.hover,
      },
    },
    tableCell: {
      width: 160,
    },
    paginationCell: {
      width: '100%',
    },
    emptyRow: {},
  });

export interface INewSingleTableProps extends WithStyles<typeof styles> {
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
    const { singleTableResults, classes } = this.props;
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
              <TableRow>
                <TableCell
                  className={classes.headerCell}
                  component="th"
                  scope="row"
                  align="left"
                >
                  Date
                </TableCell>
                <TableCell
                  className={classes.headerCell}
                  component="th"
                  scope="row"
                  align="left"
                >
                  DataType
                </TableCell>
                <TableCell
                  className={classes.headerCell}
                  component="th"
                  scope="row"
                  align="left"
                >
                  Station ID
                </TableCell>
                <TableCell
                  className={classes.headerCell}
                  component="th"
                  scope="row"
                  align="left"
                >
                  Attributes
                </TableCell>
                <TableCell
                  className={classes.headerCell}
                  component="th"
                  scope="row"
                  align="left"
                >
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? singleTableResults.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : singleTableResults
              ).map((result, idx) => (
                <TableRow className={classes.tableRow} key={idx}>
                  <TableCell
                    className={classes.tableCell}
                    component="th"
                    scope="row"
                  >
                    {result.date}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {result.datatype}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {result.station}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {result.attributes}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {result.value}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={5}
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

export default withStyles(styles)(NewSingleTable);
