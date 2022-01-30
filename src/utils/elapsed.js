const elapsed = (value) => {
  if (!value) return "";
  var date = new Date(value);
  var now = new Date(Date.now());
  var difference = now.getTime() - date.getTime();

  var years = Math.floor(difference / 1000 / 60 / 60 / 24 / 31 / 12);
  var months = Math.floor(difference / 1000 / 60 / 60 / 24 / 31);
  var days = Math.floor(difference / 1000 / 60 / 60 / 24);
  var hours = Math.floor(difference / 1000 / 60 / 60);
  var minutes = Math.floor(difference / 1000 / 60);
  var seconds = Math.floor(difference / 1000);

  let elapsed;
  if (years == 0) {
    if (months == 0) {
      if (days == 0) {
        if (hours == 0) {
          if (minutes == 0) {
            if (seconds != 0) {
              seconds == 1
                ? (elapsed = seconds + " second ago")
                : (elapsed = seconds + " seconds ago");
            } else {
              return "Just now";
            }
          } else {
            minutes == 1
              ? (elapsed = minutes + " minute ago")
              : (elapsed = minutes + " minutes ago");
          }
        } else {
          hours == 1
            ? (elapsed = hours + " hour ago")
            : (elapsed = hours + " hours ago");
        }
      } else {
        days == 1
          ? (elapsed = days + " day ago")
          : (elapsed = days + " days ago");
      }
    } else {
      months == 1
        ? (elapsed = months + " month ago")
        : (elapsed = months + " months ago");
    }
  } else {
    years == 1
      ? (elapsed = years + " year ago")
      : (elapsed = years + " years ago");
  }
  return elapsed;
};
export default elapsed;
