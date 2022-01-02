
function prefix0(num) {
  return (num.length < 2) ? '0' + num : num;
}

function formatDate(date) {
  const d = new Date(date);
  return [
    d.getFullYear(),
    prefix0('' + (d.getMonth() + 1)),
    prefix0('' + d.getDate())
  ].join('-');
}

function parseTime(time) {
  const timeSplit = time.split(':');
  if (timeSplit.length !== 2) {
    return 0;
  }
  const min = parseInt(timeSplit[0]);
  const sec = parseInt(timeSplit[1]);
  return 60 * min + sec;
}

function parseUsername(username) {
  return username.replace('(you)', '').trim();
}

function crawlPage() {
  // TODO: make the sure page says The Mini Crossword .lbd-type__subhead

  const dateString = $('.lbd-type__date').text();
  const date = formatDate(dateString);

  const entries = [];
  $('.lbd-score:not(.no-rank)').each((_i, elem) => {
    const usernameString = $(elem).children('.lbd-score__name').text();
    const timeString = $(elem).children('.lbd-score__time').text();

    const time = parseTime(timeString);
    if (time === 0) {
      return;
    }
    const username = parseUsername(usernameString);

    entries.push({ date, username, time });
  });

  return entries;
}

function makeHeader() {
  $('.lbd-board__header').append(`<h4>Updating</h4>`);
  $('.lbd-board__header h4').css({ padding: '0.6em' });
}

function updateHeader(newText, color = 'black') {
  $('.lbd-board__header h4').text(newText);
  $('.lbd-board__header h4').css({ color });

}

function submitEntries(entries) {
  return {
    statusCode: 200,
  };
  // return $.post(
  //   '//nytcrossword.flanny.app/.netlify/functions/batchCreate',
  //   {
  //     data: entries
  //   },
  //   (result) => {
  //     return result;
  //   }
  // ).fail(
  //   () => ({ statusCode: 'error' })
  // );
}

(async function () {
  makeHeader();
  const entries = crawlPage();
  console.table(entries);

  const result = await submitEntries(entries);

  if (result.statusCode != 200) {
    console.error('Error submitting entries');
    updateHeader('Error updating', 'red');
    return;
  }
  console.log('Successfully logged new entries');
  updateHeader('Update complete', 'green');

})();
