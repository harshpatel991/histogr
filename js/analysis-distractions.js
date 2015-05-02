//On clicking the timelline side bar button
$("#distractions-analysis-button").click(function() {
    $('#mainTabList a[href="#distractions-analysis"]').tab('show');
    fadeOutInToolBar();
    setTitleText("Distractions Analysis", "An analysis of your distracting websites.", "This tab displays detailed info about all of your selected distractions.");
});


$(document).ready(function(){
    var distractions = {"Reddit":"http://reddit.com","Facebook":"http://facebook.com","Youtube":"http://youtube.com","Buzzfeed":"http://buzzfeed.com","Imgur":"http://imgur.com"};
    var div = document.getElementById("list-group")
    //var content = document.create
    /*for (i = 0; i < 10; i++){
    $(div).append('<a href="#demo'+i+'" class="list-group-item list-group-item-success" data-toggle="collapse" data-parent="#MainMenu">Item '+i+'</a>')
    $(div).append('<div class="collapse" id="demo'+i+'"><a href="" class="list-group-item">Subitem 1</a></div>')
    }*/
    websites = Object.keys(distractions)
    for (i = 0; i < websites.length; i++){
         $(div).append('<a href="#'+i+'" class="list-group-item list-group-item-success" data-toggle="collapse" data-parent="#MainMenu">'+websites[i]+'</a>')
         $(div).append('<div class="collapse" id="'+i+'"><a href="" class="list-group-item">'+distractions[websites[i]]+'</a></div>')
    }
});