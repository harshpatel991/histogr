chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('html/window.html', {
    "state" : "maximized"
  });
});
