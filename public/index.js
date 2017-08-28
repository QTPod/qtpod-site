$(document).ready(function(){
    
    $("#navbar-search-button").click(function(){
        var searchQuery = $("#navbar-search-input")[0].value;
        //searchQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';
        //searchQuery = searchQuery.replace(/\s/g, '');
        
        if(searchQuery != "")
        {
            var url = "/search/" + searchQuery;
            window.location.href = url;
        }
    });
    
    $("#navbar-search-input").keydown(function(e){
        if(e.which === 13)
            $("#navbar-search-button").click();
    });

    $("#play-button").click(function(){
       alert("You clicked the play button");       
        
    });
    
});