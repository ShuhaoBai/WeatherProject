import React from 'react';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment, { Moment } from 'moment';
import styled from '@emotion/styled';
import DatePickerNav from './DatePickerNav';
const OuterWrapper = styled.div`
  [type='text'] {
    margin: 0;
    font-size: 1rem;
  }
  .DateInput_fang {
    top: 56px !important;
  }
  .DateRangePicker_picker {
    z-index: 1000;
  }
`;

export interface DateRange {
  startDate: Moment | null;
  endDate: Moment | null;
}

export interface IDatePickerProps {
  getSelectednewStartDate: (newStartDate: Moment) => void;
  getSelectednewEndDate: (newEndDate: Moment) => void;
  oldestAllowed?: Moment;
  newestAllowed?: Moment;
}

export interface IDatePickerState {
  focusedInput: any;
  /**The currently selected start date. */
  startDate: Moment | null;
  /**The currently selected end date */
  endDate: Moment | null;
  /** ID to apply to the start date input */
  startDateId: string;
  /** ID to apply to the end date input */
  endDateId: string;
  /**The oldest date which can be included in the range */
  oldestAllowed: Moment | null;
  /**The most recent date which cna be included in the range */
  newestAllowed: Moment | null;
  // dateRange: Moment[];
}

class DatePicker extends React.Component<IDatePickerProps, IDatePickerState> {
  wrapperRef: React.RefObject<HTMLDivElement>;
  constructor(props: IDatePickerProps) {
    super(props);
    this.wrapperRef = React.createRef();
    this.state = {
      focusedInput: null,
      startDate: null,
      endDate: null,
      startDateId: '',
      endDateId: '',
      oldestAllowed: null,
      newestAllowed: null,
    };
  }
  isDisabledDate = (dateOption: Moment): boolean => {
    const { oldestAllowed, newestAllowed } = this.state;
    if (oldestAllowed && newestAllowed) {
      return (
        dateOption.isBefore(oldestAllowed, 'day') ||
        dateOption.isAfter(newestAllowed, 'day')
      );
    }

    return false;
  };
  componentDidUpdate(
    prevProps: any,
    prevState: {
      startDate: moment.Moment | null;
      endDate: moment.Moment | null;
    }
  ) {
    if (prevState.startDate !== this.state.startDate) {
      if (this.state.startDate) {
        this.props.getSelectednewStartDate(this.state.startDate);
      }
    }
    if (prevState.endDate !== this.state.endDate) {
      if (this.state.endDate) {
        this.props.getSelectednewEndDate(this.state.endDate);
      }
    }
  }

  render() {
    const {
      oldestAllowed,
      newestAllowed,
      startDateId,
      endDateId,
      endDate,
      startDate,
      focusedInput,
    } = this.state;
    // const { oldestAllowed, newestAllowed } = this.props;
    return (
      <OuterWrapper ref={this.wrapperRef}>
        <DateRangePicker
          startDate={startDate}
          startDateId={startDateId}
          endDate={endDate}
          endDateId={endDateId}
          isOutsideRange={this.isDisabledDate}
          // onDatesChange={({ startDate, endDate }) => {
          //   this.setState({
          //     startDate: startDate,
          //     endDate: endDate,
          //   });
          // }}
          onDatesChange={({ startDate, endDate }) => {
            this.setState({
              startDate: startDate,
              endDate: endDate,
            });
          }}
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={(focusedInput) => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          displayFormat="YYYY-MM-DD"
          renderMonthElement={({ month, onYearSelect }) => (
            <DatePickerNav
              monthBeingShown={month}
              onYearSelect={onYearSelect}
              oldestAllowed={this.props.oldestAllowed}
              newestAllowed={this.props.newestAllowed}
            />
          )}
          numberOfMonths={2}
        />
      </OuterWrapper>
    );
  }
}
export default DatePicker;
