const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });

function prefix0(num) {
  return (num.length < 2) ? '0' + num : num;
}

function getFormattedDate() {
  const d = new Date();
  return [
    d.getFullYear(),
    prefix0('' + (d.getMonth() + 1)),
    prefix0('' + d.getDate())
  ].join('-');
}

// send the http request
const date = getFormattedDate();
let result = await lib.http.request['@1.1.6'].get({
  url: `https://nytcrosswordplus.flanny.app/api/readDailyStats`,
  queryParams: {
    'groupName': process.env.GROUP_NAME,
    'date': date
  }
});

// error check before getting data
if (result.statusCode !== 200) {
  return;
}
const data = result.data;

// format the message
const winnersText = data.winners.map(
  p => `${p.place}. ${p.username} = ${p.time}`
);
const content = `
Congratulations to Today's Winners:
${winnersText.join('\n')}

The group's average time was ${data.groupAverageTime}`;

// send to discord
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: '817193529314902056',
  content,
});