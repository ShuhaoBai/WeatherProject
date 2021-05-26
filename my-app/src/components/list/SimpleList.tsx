import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { IStationDataTypeResults } from '../../models/StationDataType';
export interface ISimpleListProps {
  avaiableDataTypeResults: IStationDataTypeResults[];
  getMenuItemValue: (menuItemValue: string) => void;
}
export interface ISimpleListState {
  id: string;
}
class SimpleList extends React.Component<ISimpleListProps, ISimpleListState> {
  constructor(props: ISimpleListProps) {
    super(props);
    this.state = {
      id: '',
    };
  }
  handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState(
      {
        id: event.target.value as string,
      },
      () => this.props.getMenuItemValue(this.state.id)
    );
  };

  render() {
    const { avaiableDataTypeResults } = this.props;
    let menuItems;
    if (avaiableDataTypeResults && avaiableDataTypeResults.length > 0) {
      menuItems = avaiableDataTypeResults.map((result, idx) => (
        <MenuItem value={result.id} key={idx}>
          {result.id}
        </MenuItem>
      ));
    } else {
      menuItems = (
        <MenuItem value="Not Available" key={0}>
          Not Available
        </MenuItem>
      );
    }
    return (
      <div>
        <FormControl>
          <InputLabel id="datatype-label">Data Set ID</InputLabel>
          <Select
            labelId="datatype-label"
            id="select"
            value={this.state.id}
            onChange={(event) => this.handleChange(event)}
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
    );
  }
}
export default SimpleList;
