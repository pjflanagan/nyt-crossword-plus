
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

const dateString = $('.lbd-type__date').text();
const date = formatDate(dateString);
console.log(date);

$('.lbd-score:not(.no-rank)').each((elem) => {
  const name = $(elem).children('.lbd-score__name');
  const time = $(elem).children('.lbd-score__time');
  console.log(name, time);
});
