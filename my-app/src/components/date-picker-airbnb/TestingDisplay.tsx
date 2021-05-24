import React from 'react';
import moment, { Moment } from 'moment';
export interface ITestingDisplayProps {
  startDate: Moment | null;
  endDate: Moment | null;
}
class TestingDisplay extends React.Component<ITestingDisplayProps> {
  render() {
    const { startDate, endDate } = this.props;

    return (
      <React.Fragment>
        <h1>New Selected Start Date</h1>
        <h2>{startDate?.format().slice(0, 10)}</h2>
        <h1>New Selected End Date</h1>
        <h2>{endDate?.format().slice(0, 10)}</h2>
      </React.Fragment>
    );
  }
}
export default TestingDisplay;
