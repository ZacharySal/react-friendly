import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const getTwitterTime = (time) => {
  return timeAgo.format(new Date(time), "twitter");
};
