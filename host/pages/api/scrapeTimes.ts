export { }

// TODO: this endpoint gets called daily by autocode and runs Selenium to get
// the data from the leaderboard

// https://www.selenium.dev/documentation/webdriver/elements/finders/

// import { Builder, By } from 'selenium-webdriver';

// (async function example() {
//     let driver = await new Builder().forBrowser('firefox').build();
//     try {
//         // Navigate to Url
//         await driver.get('https://www.example.com');

//         // Get all the elements available with tag 'p'
//         let elements = await driver.findElements(By.css('p'));
//         for(let e of elements) {
//             console.log(await e.getText());
//         }
//     }
//     finally {
//         await driver.quit();
//     }
// })();
