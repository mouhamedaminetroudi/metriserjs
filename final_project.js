const apis = "https://tarmeezAcademy.com/api/v1";

setupnavbar();

axios.get(`${apis}/posts`)
.then((response)=>{
    const posts = response.data.data;
    document.getElementById("posts").innerHTML = "";
    for(let post of posts){
        let author = post.author;
        let content = `
        <div class="card shadow my-2">
            <div class="card-header">
                <img src="postimg/amin.png" style="width:50px; height:50px;" class="rounded-circle border border-1">
                <b>${author.username}</b>
            </div>
            <div class="card-body">
                <img src="${post.image}" style="width:100%">
                <h6 class="text-muted mt-1">${post.created_at}</h6>
                <h5>${post.title}</h5>
                <p>${post.body}</p>
                <!-- pencil (outline) -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zM2.5 11.5v.5a.5.5 0 0 0 .5.5H3v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .324-.094l.106-.106  -?"/>
                </svg>
                <span>(${post.comments_count})comment</span>
                <span id="tags-${post.id}">
                
                </span>
            </div>
        </div>
`
            ;
        document.getElementById("posts").innerHTML += content;
        const currentpost=`tags-${post.id}`
        document.getElementById(currentpost).innerHTML = "";
        for(tag of post.tags){
            let tagscontent=`
            <button class="btn btn-sm rounded-5" style="background-color:gray;color:white;">${tag.name}</button>
            `
            document.getElementById(currentpost).innerHTML+=tagscontent
        }
    }
});

// Login function
function login(){
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    axios.post(`${apis}/login`, {username: user, password: password})
    .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setupnavbar(); 

        alert("Login successful!");
        const loginModalEl = document.getElementById("exampleModal");
        const modal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
        modal.hide();
        successful()
        setupnavbar()   
        
    })
    .catch(err => {
        console.error(err);
    
        
    });
}

// Navbar setup
function setupnavbar(){
    const token = localStorage.getItem("token");
    const logbt = document.getElementById("logbt");
    const regbt = document.getElementById("regbt");
    const logoutBtn = document.getElementById("logout");

        if(token == null){
        logbt.style.display= "block";
        regbt.style.display= "block";
        logoutBtn.style.display="none"; 
    }   else{
        logbt.style.display="none";
        regbt.style.display = "none";
        logoutBtn.style.display= "block";
    }   
}

function logout(){
    // Logout
    document.getElementById("logout").addEventListener("click", ()=>{
    localStorage.clear();
    setupnavbar();
    
});
}
function successful(){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const alert = (message, type) => {
     const wrapper = document.createElement('div')
     wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
    }
    alert('Nice, you triggered this alert message!','succes')
    setTimeout(()=>{
        const Alert =bootstrap.Alert.get0rCreateInstance('#liveAlertPlaceholder')
        Alert.close()
    },2000)

}
function regester(){

    const name = document.getElementById("namereg").value;
    const username = document.getElementById("userreg").value;
    const password = document.getElementById("passwordreg").value;
    console.log(name,username,password);
    
    axios.post(`${apis}/register`, {username: username , password: password, name: name})
    .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setupnavbar(); 
    
        alert("regester successful!");
        const loginModalEl = document.getElementById("exampleModal");
        const modal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
        modal.hide();
        successful()
        setupnavbar()   
            
        })
        .catch(err => {
            console.error(err);
        
            
        });
    }

