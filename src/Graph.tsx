import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      price_abc: 'float',
      price_def: 'float',
      ratio: 'float',
      timestamp: 'date',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
    };

    if (window.perspective) {
      this.table = window.perspective.worker().table(schema);

      // Ensure this.table is defined before calling load
      if (this.table) {
        elem.load(this.table);
      } else {
        console.error("Table is undefined.");
      }

      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.data !== prevProps.data) {
      if (this.table) {
        const generatedRow = DataManipulator.generateRow(this.props.data);

        // Log generated row for debugging
        console.log("Generated Row:", generatedRow);

        if (generatedRow.length > 0) {
          this.table.update(generatedRow);
        } else {
          console.warn("No data to update the graph.");
        }
      } else {
        console.error("Table is not defined.");
      }
    }
  }
}

export default Graph;
