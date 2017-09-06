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
    
    $("body").scrollspy({
        target: "#myNavbar",
        offset: 50
    });

    $('[data-toggle="popover"]').popover();
    
    $('#email-btn').click(function() {
        alert('Oops, something bad happened. Please shoot us an email instead.')
    });
    
    
    $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 45
        }, 800, function() {

          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) {
            return false;
          } else {
            $target.attr('tabindex','-1');
            $target.focus();
          };
        });
      }
    }
  });
  
  
    
});
