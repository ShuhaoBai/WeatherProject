import React from 'react';
import { Theme, createStyles, withStyles } from '@material-ui/core/styles';
import { Moment } from 'moment';
import {
  fetchStationDateRange,
  fetchNextOrPreviousPageStation,
  fetchSingleStationAvailableDataType,
} from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IStationsResults } from '../models/Stations';
import { IStationDataTypeResults } from '../models/StationDataType';
import { Button } from '@material-ui/core';
import TablePaginationActions from './table-core/TablePaginationActions';

//---table related methods
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
//---table related methods
export interface IWeatherStationTableProps {
  results: IStationsResults[];
  getSelectedStationIdAndName: (
    selectedStationId: string,
    selectedStationName: string
  ) => void;
  getStationDateRange: (
    newestAllowed: Moment | undefined,
    oldestAllowed: Moment | undefined
  ) => void;
  getNextOrPreviousPageStationData: (
    nextPageResults: IStationsResults[]
  ) => void;
  getStationAvailableDataType: (
    avaiableDataTypeResults: IStationDataTypeResults[]
  ) => void;
}
export interface IWeatherStationTableState {
  page: number;
  rowsPerPage: number;
  pageChangeCount: number;
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
      pageChangeCount: 0,
    };
  }
  componentDidUpdate(prevProps: any, prevState: { pageChangeCount: number }) {
    if (prevState.pageChangeCount !== this.state.pageChangeCount) {
      let updatedPageCount = this.state.pageChangeCount * 25;
      this.startFetchingNextOrPreviousPageStation(updatedPageCount);
    }
  }
  //---table related methods
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
  //---table related methods
  handleRowClick = (cellValue: string, selectedStationName: string) => {
    const stationId = cellValue;
    this.props.getSelectedStationIdAndName(stationId, selectedStationName);
    this.startFetchingStationDateRange(stationId);
    this.startFetchingSingleStationAvailableDataType(stationId);
  };

  startFetchingSingleStationAvailableDataType = async (
    selectedStationId: string
  ) => {
    const fetchedSingleStationAvailableDataType =
      await fetchSingleStationAvailableDataType(selectedStationId);
    if (fetchedSingleStationAvailableDataType) {
      this.props.getStationAvailableDataType(
        fetchedSingleStationAvailableDataType.results
      );
    }
  };

  onPreviousBtnClick = () => {
    if (this.state.pageChangeCount > 0) {
      this.setState(
        {
          pageChangeCount: this.state.pageChangeCount - 1,
        },
        () =>
          this.startFetchingNextOrPreviousPageStation(
            this.state.pageChangeCount * 25
          )
      );
    } else {
      alert('Reached the beginning of the data list...');
    }
  };
  onNextBtnClick = () => {
    this.setState(
      {
        pageChangeCount: this.state.pageChangeCount + 1,
      },
      () =>
        this.startFetchingNextOrPreviousPageStation(
          this.state.pageChangeCount * 25
        )
    );
  };

  startFetchingNextOrPreviousPageStation = async (offset: number) => {
    const fetchedNextPageStationData = await fetchNextOrPreviousPageStation(
      offset
    );
    if (fetchedNextPageStationData) {
      this.props.getNextOrPreviousPageStationData(
        fetchedNextPageStationData.results
      );
    }
  };

  startFetchingStationDateRange = async (stationId: string) => {
    const fetchedDateRange = await fetchStationDateRange(stationId);
    this.props.getStationDateRange(
      fetchedDateRange?.convertedMinDate,
      fetchedDateRange?.convertedMaxDate
    );
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
                onClick={() => this.handleRowClick(result.id, result.name)}
              >
                <TableCell component="th" scope="row">
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
                onChangePage={(event, newPage) =>
                  this.handleChangePage(event, newPage)
                }
                onChangeRowsPerPage={(event) =>
                  this.handleChangeRowsPerPage(event)
                }
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
            <TableRow>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.onPreviousBtnClick()}
                >
                  Previous Batch
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.onNextBtnClick()}
                >
                  Next Batch
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}
export default WeatherStationTable;
