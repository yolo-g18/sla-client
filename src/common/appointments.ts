import raw from "../common/personal.ics";
import {
  pink, purple, teal, amber, deepOrange,
} from '@material-ui/core/colors';
// import { text } from "../personal.ics";
const ical = require("ical");
const data = ical.parseICS(raw);
var temp = [];

for (let k in data) {
  if (data.hasOwnProperty(k)) {
    var ev = data[k];
    if (data[k].type == "VEVENT") {
      var event = ev.summary;
      var start = ev.start;
      var end = ev.end;
      if(ev.rrule !== undefined){
        var rrule = ev.rrule.toString();
      var url = "null";
      if(ev.url !== undefined){
      url = ev,url
      }
      ;}

      temp.push({
        title: event,
        startDate: start,
        endDate: end,
        id: 1,
        location: url,
        rRule: rrule
      });
    }
  }
}

export const appointments = temp;

export const resourcesData = [
  {
    text: 'Room 101',
    id: 1,
    color: amber,
  }, {
    text: 'Room 102',
    id: 2,
    color: pink,
  }, {
    text: 'Room 103',
    id: 3,
    color: purple,
  }, {
    text: 'Meeting room',
    id: 4,
    color: deepOrange,
  }, {
    text: 'Conference hall',
    id: 5,
    color: teal,
  },
];