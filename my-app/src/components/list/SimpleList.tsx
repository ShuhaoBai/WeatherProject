import React from 'react';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { IStationDataTypeResults } from '../../models/StationDataType';

export interface ISimpleListProps extends WithStyles<typeof styles> {
  avaiableDataTypeResults: IStationDataTypeResults[];
  getMenuItemValue: (menuItemValue: string) => void;
}

export interface ISimpleListState {
  id: string;
}
const styles = ({ spacing }: Theme) =>
  createStyles({
    formControl: {
      margin: spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: spacing(2),
    },
  });

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
    const { avaiableDataTypeResults, classes } = this.props;
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
        <FormControl className={classes.formControl}>
          <InputLabel id="datatype-label">Data Set ID</InputLabel>
          <Select
            labelId="datatype-label"
            id="select"
            value={this.state.id}
            onChange={(event) => this.handleChange(event)}
            className={classes.selectEmpty}
          >
            {menuItems}
          </Select>
        </FormControl>
      </div>
    );
  }
}
export default withStyles(styles)(SimpleList);
