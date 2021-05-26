import React from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
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
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
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
      cursor: 'pointer',
      '&:nth-of-type(odd)': {
        backgroundColor: palette.action.hover,
      },
    },
    tableCell: {
      width: 160,
    },
    btnCell: {
      padding: 'inherit',
    },
  });

export interface IWeatherStationTableProps extends WithStyles<typeof styles> {
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
    const { results, classes } = this.props;
    const { page, rowsPerPage } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, results.length - page * rowsPerPage);
    return (
      <TableContainer component={Paper}>
        <Table aria-label="weather station table">
          <TableHead>
            <TableRow>
              <TableCell
                className={classes.headerCell}
                component="th"
                scope="row"
                align="left"
              >
                Station Name
              </TableCell>
              <TableCell
                className={classes.headerCell}
                component="th"
                scope="row"
                align="right"
              >
                Latitude
              </TableCell>
              <TableCell
                className={classes.headerCell}
                component="th"
                scope="row"
                align="right"
              >
                Longitude
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? results.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : results
            ).map((result, idx) => (
              <TableRow
                className={classes.tableRow}
                key={idx}
                onClick={() => this.handleRowClick(result.id, result.name)}
              >
                <TableCell
                  className={classes.tableCell}
                  component="th"
                  scope="row"
                >
                  {result.name}
                </TableCell>
                <TableCell className={classes.tableCell} align="right">
                  {result.latitude}
                </TableCell>
                <TableCell className={classes.tableCell} align="right">
                  {result.longitude}
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
              <TableCell></TableCell>
              <TableCell className={classes.btnCell}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => this.onPreviousBtnClick()}
                  size="small"
                >
                  <FastRewindIcon />
                  Batch
                </Button>
              </TableCell>
              <TableCell className={classes.btnCell}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => this.onNextBtnClick()}
                  size="small"
                >
                  Batch
                  <FastForwardIcon />
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}
export default withStyles(styles)(WeatherStationTable);
