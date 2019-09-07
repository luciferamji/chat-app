

$("#create").click(function (){
 
   if($("#roomname").val()==''&&$("#password").val()=='')
   return 0
    if($("#password").val().length<=7)
   return $('#message').text("Password must be greater than 7")
   if($("#password").val()!=$("#cnfpass").val())
   return $('#message').text("Passwords are not matching")
   
   var room={name:$("#roomname").val(),password:$("#password").val()}
     async function abc(){
    await $.ajax({
        url: 'http://localhost:3000/createroom',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if(data.error)
           return $('#message').text("room exist with same name ,try another room")
            
           $('#message').text("Room created successfully")
           const obj={username:$("#name").val(),roomname:$("#roomname").val()}
             
           sessionStorage.setItem("roomdata",JSON.stringify(obj))
          window.location.href='./chat.html'
        },
        data: JSON.stringify(room)
    });
     }
     abc().then(console.log("success"))

})






