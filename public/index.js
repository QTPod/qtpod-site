$(document).ready(function(){
    
    $("#navbar-search-button").click(function(){
        var searchQuery = $("#navbar-search-input")[0].value;
        
        if(searchQuery.trim() != "")
        {
            var url = "/search/" + searchQuery;
            window.location.href = url;
        }
    });
    
    $("#navbar-search-input").keydown(function(e){
        if(e.which === 13)
            $("#navbar-search-button").click();
    });
    
    $(".play-button").click(function(){
        //play episode!

    });

    $('[data-toggle="popover"]').popover();
    
    $('#email-btn').click(function() {
        alert('Oops, something bad happened. Please shoot us an email instead.')
    });
    
});
