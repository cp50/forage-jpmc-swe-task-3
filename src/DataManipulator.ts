import { ServerRespond } from './DataStreamer';

export interface Row {
 price_abc:number,
 price_def:number,
 ratio :number,
upper_bound :number,
lower_bound :number,
trigger_alert: number | undefined,
timestamp: Date,
}



export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Array<Record<string, (string | number | boolean | Date)[]>> {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;

    return [{
      price_abc: [priceABC], // Wrap in an array
      price_def: [priceDEF], // Wrap in an array
      ratio: [ratio],        // Wrap in an array
      timestamp: [
        serverRespond[0].timestamp > serverRespond[1].timestamp
          ? serverRespond[0].timestamp
          : serverRespond[1].timestamp
      ],
      upper_bound: [upperBound], // Wrap in an array
      lower_bound: [lowerBound], // Wrap in an array
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? [ratio] : [], // Return an empty array if no alert
    }];
  }
}

