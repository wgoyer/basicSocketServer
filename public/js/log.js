function updateLog(event, data) {
  var timeStamp = getTimeStamp(),
      eventTag;

  timeStamp = `<span class='log-timestamp'>${timeStamp}</span>`;

  if(event === 'connect' || event === 'clientConnect') {
    eventTag = `<span class='log-event log-connect'>${event}</span>`;
  } else if(event === 'disconnect' || event === 'clientDisconnect') {
    eventTag = `<span class='log-event log-disconnect'>${event}</span>`;
  } else {
    eventTag = `<span class='log-event'>${event}</span>`;
  }

  eventTag = wrapInBrackets(eventTag);
  timeStamp = wrapInBrackets(timeStamp);

  var message = `<span class='log-message'>${JSON.stringify(data)}</span>`,
      logMessage = `${timeStamp}${eventTag}:: ${message}`;

  elementToAppend = document.createElement('tr');
  elementToAppend.innerHTML = logMessage;
  document.querySelector('.system-log table').appendChild(elementToAppend);
}

function getTimeStamp() {
  var date = new Date(),
      year = date.getFullYear().toString(),
      month = (date.getMonth() + 1).toString(),
      day = date.getDate().toString(),
      hours = date.getHours().toString(),
      minutes = date.getMinutes().toString(),
      seconds = date.getSeconds().toString();
  
  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day: `0${day}`;
  minutes = minutes.length > 1 ? minutes : `0${minutes}`;
  seconds = seconds.length > 1 ? seconds : `0${seconds}`;

  return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
}

function wrapInBrackets(stringToWrap) {
  var oBracket = `<span class='log-bracket'>[</span>`,
      cBracket = `<span class='log-bracket'>]</span>`;
  
  return `${oBracket}${stringToWrap}${cBracket}`;
}