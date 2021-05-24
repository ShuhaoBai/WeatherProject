import React from 'react';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  withStyles,
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
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { IStationsResults } from '../models/Stations';

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

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

export interface IWeatherStationTableProps {
  results: IStationsResults[];
  getSelectedStationId: (selectedStationId: string) => void;
}
export interface IWeatherStationTableState {
  page: number;
  rowsPerPage: number;
}
class WeatherStationTable extends React.Component<
  IWeatherStationTableProps,
  IWeatherStationTableState
> {
  constructor(
    props: IWeatherStationTableProps | Readonly<IWeatherStationTableProps>
  ) {
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
    // setRowsPerPage(parseInt(event.target.value, 10));
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
    // setPage(0);
  };
  handleRowClick = (cellValue: string) => {
    const stationId = cellValue;
    console.log(stationId);
    this.props.getSelectedStationId(stationId);
  };

  render() {
    const { results } = this.props;
    const { page, rowsPerPage } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, results.length - page * rowsPerPage);
    return (
      <TableContainer component={Paper}>
        <Table aria-label="weather station table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row" align="left">
                Station Name
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" align="right">
                Latitude
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" align="right">
                Longitude
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? results.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : results
            ).map((result, idx) => (
              <StyledTableRow
                key={idx}
                onClick={() => this.handleRowClick(result.id)} // get current row station id
              >
                <TableCell
                  component="th"
                  scope="row"
                  // value={result.name}
                  // onClick={() => this.handleRowClick(result.name)}
                >
                  {result.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {result.latitude}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {result.longitude}
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
                count={results.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}
export default WeatherStationTable;
