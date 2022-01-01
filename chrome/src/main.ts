
function prefix0(num: string): string {
  return (num.length < 2) ? '0' + num : num;
}

function formatDate(date: string): string {
  const d = new Date(date);
  return [
    d.getFullYear(),
    prefix0('' + (d.getMonth() + 1)),
    prefix0('' + d.getDate())
  ].join('-');
}

function parseTime(time: string): number {
  return Moment(time, 'mm:ss').getSeconds();
}


const dateString = $('.lbd-type__date').text();
const date = formatDate(dateString);
console.log(date);

$('.lbd-score:not(.no-rank)').each((elem) => {
  const name = $(elem).children('.lbd-score__name');
  const timeString = $(elem).children('.lbd-score__time');
  const time = parseTime(timeString);
  console.log(name, time);
});
