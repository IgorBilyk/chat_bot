const moment = require("moment");

formatMessage = (username, text) => {
  return {
    username,
    text,
    date: moment().format("h:mm a"),

  };
};

module.exports = formatMessage;
