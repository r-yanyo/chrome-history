const day = 1000 * 60 * 60 * 24;
const week = day * 7;
const startTimeDay = new Date().getTime() - day;
const startTimeWeek = new Date().getTime() - week;

window.addEventListener("load", function() {
  this.getVisitedCount(startTimeDay).then(visitedCount => {
    visitedCountElement = document.getElementById("visitedCountDay");
    visitedCountElement.textContent = visitedCount;
  });
  this.getVisitedCount(startTimeWeek).then(visitedCount => {
    visitedCountElement = document.getElementById("visitedCountWeek");
    visitedCountElement.textContent = visitedCount;
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
