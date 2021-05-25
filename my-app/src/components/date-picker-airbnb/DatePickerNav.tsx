import React from 'react';
import { Moment } from 'moment';
import styled from '@emotion/styled';

export interface IDatePickerNavProps {
  monthBeingShown: Moment;
  onYearSelect: (monthBeingShown: Moment, newYear: string) => void;
  newestAllowed: Moment | undefined;
  oldestAllowed: Moment | undefined;
}
export interface IDatePickerNavState {}
const OuterWrapper = styled.div`
  white-space: nowrap;
  margin-top: -4px;
`;
const Select = styled.select`
  width: 5rem;
  padding-top: 6px;
  padding-bottom: 6px;
  margin-left: 0.5rem;
`;
class DatePickerNav extends React.Component<
  IDatePickerNavProps,
  IDatePickerNavState
> {
  handleYearChange = (changeEvent: { target: { value: any } }) => {
    const { monthBeingShown, onYearSelect } = this.props;
    const newYear = changeEvent.target.value;
    onYearSelect(monthBeingShown, newYear);
  };
  render() {
    const { monthBeingShown, newestAllowed, oldestAllowed } = this.props;
    const currentYear = monthBeingShown.year();
    let years = [];
    if (newestAllowed && oldestAllowed) {
      for (
        let year = newestAllowed.year();
        year >= oldestAllowed.year();
        year--
      ) {
        years.push(year);
      }
    } else {
      for (let year = currentYear + 30; year > currentYear - 30; year--) {
        years.push(year);
      }
    }
    return (
      <OuterWrapper>
        <strong>{monthBeingShown.format('MMMM')}</strong>
        <Select value={currentYear} onChange={this.handleYearChange}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </OuterWrapper>
    );
  }
}

export default DatePickerNav;
