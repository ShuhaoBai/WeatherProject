import React from 'react';
import moment, { Moment } from 'moment';
import {
  fetchSingleStation,
  fetchStationsWithinRange,
  fetchSingleStationYealySummaryWithStationId,
} from '../api';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import { IPrecipStationResults } from '../models/PrecipStation';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

//------Table related-------
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
//------Table related-------

export interface ISingleWeatherStationTableProps {
  stationId: string;
  elevation: number;
  elevationUnit: string;
  id: string;
  latitude: string;
  longitude: string;
  maxdate: string;
  mindate: string;
  name: string;
  bufferStartDate?: Moment;
  bufferEndDate?: Moment;
}
export interface ISingleWeatherStationTableState {
  results: IPrecipStationResults[];
  page: number;
  rowsPerPage: number;
}

class SingleWeatherStationTable extends React.Component<
  ISingleWeatherStationTableProps,
  ISingleWeatherStationTableState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      results: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  //---table related methods---
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

  //---table related methods---

  startFetchingSingleStationYearlySummaryWithStationId = async (
    stationId: string,
    bufferStartDate: Moment,
    bufferEndDate: Moment
  ) => {
    if (this.props.bufferStartDate && this.props.bufferEndDate) {
      const fetchedSingleStationYealySummaryDataWithStationId =
        await fetchSingleStationYealySummaryWithStationId(
          this.props.stationId,
          this.props.bufferStartDate,
          this.props.bufferEndDate
        );
      if (fetchedSingleStationYealySummaryDataWithStationId) {
        this.setState({
          results: fetchedSingleStationYealySummaryDataWithStationId.results,
        });
      }
      console.log(fetchedSingleStationYealySummaryDataWithStationId);
    }
  };

  async componentDidUpdate(
    prevProps: {
      stationId: string;
      bufferStartDate?: Moment;
      bufferEndDate?: Moment;
    },
    prevState: any
  ) {
    if (
      prevProps.bufferStartDate !== this.props.bufferStartDate &&
      prevProps.bufferEndDate !== this.props.bufferEndDate
    ) {
      if (this.props.bufferStartDate && this.props.bufferEndDate) {
        await this.startFetchingSingleStationYearlySummaryWithStationId(
          this.props.stationId,
          this.props.bufferStartDate,
          this.props.bufferEndDate
        );
      }
      // console.log('inside componentDidUpdate()');
    }
  }

  render() {
    const { results } = this.state;
    const { page, rowsPerPage } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, results.length - page * rowsPerPage);
    return (
      //-----old testing divs-------
      // <div>
      //   <h1>{this.props.stationId}</h1>
      //   <h1>
      //     {this.props.elevation}
      //     {this.props.elevationUnit}
      //   </h1>
      //   <h1>{this.props.id}</h1>
      //   <h1>{this.props.latitude}</h1>
      //   <h1>{this.props.longitude}</h1>
      //   <h1>{this.props.maxdate}</h1>
      //   <h1>{this.props.mindate}</h1>
      //   <h1>{this.props.name}</h1>
      // </div>
      //-----old testing divs-------
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
              ? results.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : results
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
export default SingleWeatherStationTable;