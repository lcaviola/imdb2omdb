var Person = function() {
    this.omdb_id
    this.name
    this.character
    this.job
}

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.stripTags = function() {
    return this.replace(/<\/?[^>]+>/gi, '');
};
String.prototype.stripBrackets = function() {
    return this.replace(/\(\/?[^\)]+\)/gi, '');
};
String.prototype.clean = function() {
    return this.stripTags().stripBrackets().replace(/&nbsp;/g, ' ').trim();
};

function openUrlToNewTab(url) {
    var windowManager = (Components.classes["@mozilla.org/appshell/window-mediator;1"])
    .getService();
    var windowManagerInterface = windowManager
    .QueryInterface(Components.interfaces.nsIWindowMediator);
    var browser = (windowManagerInterface
        .getMostRecentWindow("navigator:browser")).getBrowser();
    var newTab = browser.addTab(url);
    browser.selectedTab = newTab;
}
