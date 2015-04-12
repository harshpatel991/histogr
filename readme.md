Histogr README

To install:

1. Bring up the apps and extensions management page by clicking the settings icon  and choosing Tools > Extensions.
2. Make sure the Developer mode checkbox has been selected.
3. Click the Load unpacked extension button, navigate to your app's folder and click OK.

Bootstrap, jQuery, and d3.js have already been imported

<h1>Important Files</h1>

/js/background.js - This is the file that opens the window.
/html/window.html - This is the HTML that is displayed on the newly opened window. There are buttons for the tabs and empty tabpanels where the content for each tab should go.
/js/navigation - On load this will go to each tab panel, read one of the HTML files (nodes.html, timeline.html, analysis.html, or banlist.html) and fill in its content into the the appropriate tabpanel. This is so that the window.html page is not overly cluttered and each of the pages can be worked on separately.
After the page is loaded into the tabpanel, any appropriate javscript is executed.

/css/custom.css - Any additional CSS that needs to be added
