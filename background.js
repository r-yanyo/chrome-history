chrome.runtime.onInstalled.addListener(function() {});

const day = 1000 * 60 * 60 * 24;
const week = day * 7;
const startTime = new Date().getTime() - day;

chrome.tabs.onUpdated.addListener(function(activeInfo) {
  this.getVisitedCount(startTime).then(visitedCount => {
    chrome.browserAction.setBadgeText({ text: visitedCount.toString() });
  });
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
  this.getVisitedCount(startTime).then(visitedCount => {
    chrome.browserAction.setBadgeText({ text: visitedCount.toString() });
  });
});

function getVisitedCount(startTime) {
  return new Promise(resolve => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function(tabs) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      chrome.history.getVisits({ url }, function(results) {
        let visitedCount = 0;
        for (let index = results.length - 1; index >= 0; index--) {
          const element = results[index];
          if (startTime <= element.visitTime) visitedCount++;
          else break;
        }
        return resolve(visitedCount);
      });
    });
  });
}
