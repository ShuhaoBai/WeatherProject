import React, { Fragment } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';

export interface IDatePickerProps {}

export interface IDatePickerState {
  selectedDate: Date;
}

class DatePickerComponent extends React.Component<
  IDatePickerProps,
  IDatePickerState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
  }
  handleDateChange = (date: any) => {
    this.setState({
      selectedDate: date,
    });
  };
  render() {
    const { selectedDate } = this.state;
    return (
      <Fragment>
        <KeyboardDatePicker
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="With keyboard"
          format="MM/dd/yyyy"
          value={selectedDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={(date) => this.handleDateChange(date)}
        />
      </Fragment>
    );
  }
}

export default DatePickerComponent;
