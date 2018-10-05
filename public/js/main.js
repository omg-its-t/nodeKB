$(document).ready(function(){
  //when the class  is clicked on we will run the function
  $('.delete-article').on('click', function(e){
    $target = $(e.target);
    const id = ($target.attr('data-id'));   //put the id in a variable to make a request with

    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function(response){
        alert('Deleting Article');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
