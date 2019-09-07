const $username=document.querySelector('#username')
const $room=document.querySelector('#room')
const $password=document.querySelector('#password')
const $join=document.querySelector('#join')

$join.addEventListener('click',()=>{

const username=$username.value
const room=$room.value
const password=$password.value

if(username!=''&&room!=''&&password!='')
{var roomdata={name:room,password}
var roomid={}
async function abc()    
{ await $.ajax({
        url: 'https://akshat-chat-app.herokuapp.com/joinroom',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: (data)=> {
         
         roomid=data

        },
        data: JSON.stringify(roomdata)
    });
   
}
abc().then(()=>{
console.log(roomid.error)
if(roomid.error)
return $("#message").text(roomid.error)

const obj={username,roomname:room}
             
    sessionStorage.setItem("roomdata",JSON.stringify(obj))
window.location.href="./chat.html"


})


}

    })
    

