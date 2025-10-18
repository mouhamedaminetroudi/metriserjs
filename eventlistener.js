
document.getElementById("bt1").addEventListener("click",function(){
    let first=document.getElementById("n1").value
    let second=document.getElementById("n2").value
    try{
      let res=  divise(Number(first),Number(second));  
      document.getElementById("res").innerHTML=res;  
    }catch(error){
        alert ("error: "+error)    }


  //console.log(res)

})