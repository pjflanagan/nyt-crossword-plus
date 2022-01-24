
const COLORS = {
  BLUE: '#3981f0',
  RED: 'red',
  GREEN: 'green',
}

// Formatting and Parsing

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

// Crawling

function crawlHeaderForValidation() {
  const titleString = $('.lbd-type__subhead').text().trim();
  return titleString === 'The Mini Crossword';
}

function crawlPage() {
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

// Output

function makeHeader() {
  $('.lbd-board__header').append(`<h4></h4>`);
  $('.lbd-board__header h4').css({ padding: '0.6em' });
}

function updateHeader(newText, color = 'black') {
  $('.lbd-board__header h4').text(newText);
  $('.lbd-board__header h4').css({ color });

}

// Data

async function submitEntries(entries) {
  if (entries.length === 0) {
    return {
      errorMessage: `No one has played today's crossword yet`
    }
  }

  try {
    // we do not store the response because we are using no-cors, which makes
    // the response "opaque" and unreadable, instead we just record that the 
    // request was sent, not any result from the request
    await fetch(
      `http://${DOMAIN}/api/leaderboard/write?k=${WRITE_API_KEY}`,
      {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ entries }),
      }
    );
  } catch (e) {
    return {
      errorMessage: 'Unable to upload entries'
    }
  }

  return {
    successMessage: 'Leaderboard update sent'
  }
}

// Main

(async function () {

  // validate we are on the right page
  const validPageTitle = crawlHeaderForValidation();
  makeHeader();
  if (!validPageTitle) {
    updateHeader('Info: Will only update for the Daily Mini Crossword', COLORS.BLUE);
    return;
  }
  updateHeader('Updating...');

  // crawl the page for entries
  const entries = crawlPage();
  console.table(entries);

  // submit the entries to the backend and handle errors
  const result = await submitEntries(entries);
  if (result.errorMessage && result.errorMessage !== '') {
    console.error('Error submitting leaderboard entries:', result.errorMessage);
    updateHeader(`Error: ${result.errorMessage}`, COLORS.RED);
    return;
  }
  console.log('Successfully submitted new leaderboard entries');
  updateHeader(`Success: ${result.successMessage}`, COLORS.GREEN);

})();
