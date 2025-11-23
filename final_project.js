let curruntpage=1;
let lastpage=1
/* ===== Infinite Scroll ===== */
window.addEventListener("scroll", function () {
    const endpage = window.innerHeight + window.pageYOffset >= this.document.body.offsetHeight;
    console.log("scrolling");
    if (endpage&&curruntpage<lastpage) {
        getPosts(false,curruntpage+1)
        curruntpage=curruntpage+1
        // add infinite scroll logic here
    }
});
/* ===== End Infinite Scroll ===== */

const apis = "https://tarmeezacademy.com/api/v1";


setupNavbar();
getPosts();

/* ------------------ GET POSTS ------------------ */
function getPosts(reload =true ,page=1) {
    axios.get(`${apis}/posts?limit=60&page=${page}`)
        .then((response) => {
            const posts = response.data.data;
            lastpage=response.data.meta.last_page
            if(reload){
                document.getElementById("posts").innerHTML = ""; 
            }

            for (let post of posts) {

                
                let imgSrc = (post.image && typeof post.image === "string")
                    ? post.image
                    : "postimg/default.jpg";

                let content = `
                <div class="card shadow my-2">
                    <div class="card-header">
                        <img src="postimg/amin.png" 
                             style="width:50px; height:50px;" 
                             class="rounded-circle border">
                        <b>${post.author.username}</b>
                    </div>

                    <div class="card-body" onclick="postclick(${post.id})"  style="cursor: pointer;">
                        <img src="${imgSrc}" style="width:100%">
                        <h6 class="text-muted mt-1">${post.created_at}</h6>
                        <h5>${post.title}</h5>
                        <p>${post.body}</p>

                        <span>(${post.comments_count}) Comments</span>

                        <span id="tags-${post.id}"></span>
                    </div>
                </div>
                `;

                document.getElementById("posts").innerHTML += content;

                // Ajouter les tags
                let tg = document.getElementById(`tags-${post.id}`);
                for (let tag of post.tags) {
                    tg.innerHTML += `
                        <button class="btn btn-sm rounded-5" style="background-color:gray;color:white;">
                            ${tag.name}
                        </button>
                    `;
                }
            }
        });
}

/* ------------------ LOGIN ------------------ */
function login() {
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    axios.post(`${apis}/login`, { username: user, password: password })
        .then(response => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            setupNavbar();
            alert("Login successful!");

            const loginModalEl = document.getElementById("exampleModal");
            const modal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
            modal.hide();

        })
        .catch(err => {
            console.error(err);
        });
}

/* ------------------ NAVBAR ------------------ */
function setupNavbar() {
    const token = localStorage.getItem("token");
    const logbt = document.getElementById("logbt");
    const regbt = document.getElementById("regbt");
    const logoutBtn = document.getElementById("logout");
    const addp = document.getElementById("addp");

    if (!token) {
        if(addp!=null){
            addp.style.display = "none"; 
        }
        logbt.style.display = "block";
        regbt.style.display = "block";
        logoutBtn.style.display = "none";
        

    } else {
        if(addp!=null){
            addp.style.display = "block"; 
        }
        logbt.style.display = "none";
        regbt.style.display = "none";
        logoutBtn.style.display = "block";
        

    
        const user = getUser();
        const pusername = document.getElementById("pusername");
        const pimg = document.getElementById("navp");

        if (user && pusername) pusername.innerHTML = user.username;

        if (user && pimg && user.profile_image) {
            pimg.src = user.profile_image;
        }
    }
}

/* ------------------ GET USER FROM STORAGE ------------------ */
function getUser() {
    const suser = localStorage.getItem("user");
    if (!suser) return null;
    return JSON.parse(suser);
}

/* ------------------ LOGOUT ------------------ */
function logout() {
    localStorage.clear();
    setupNavbar();
}

/* ------------------ REGISTER ------------------ */
function register() {
    alert("yeeeeeeeeeeeeeeeeeeeeeeeeeeeeees")
    const name = document.getElementById("namereg").value;
    const username = document.getElementById("userreg").value;
    const password = document.getElementById("passwordreg").value;

    let formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);

    
    const img = document.getElementById("regpr").files[0];
    if (img) {
        formData.append("image", img);
    }

    axios.post(`${apis}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setupNavbar(); 

        alert("Register successful!");
        const registerModalEl = document.getElementById("exampleModal2");
        const modal = bootstrap.Modal.getOrCreateInstance(registerModalEl);
        modal.hide();
    })
    .catch(err => {
        console.error(err.response ? err.response.data : err);
        alert(err);
    });
}


/* ------------------ POST NEW POST ------------------ */
function newpost() {
    const title = document.getElementById("title").value;
    const body = document.getElementById("bodypost").value;
    const img = document.getElementById("imgpost").files[0];

    let formdata = new FormData();
    formdata.append("body", body);
    formdata.append("title", title);
    formdata.append("image", img);

    const token = localStorage.getItem("token");

    axios.post(`${apis}/posts`, formdata, {
        headers: {
            "Content-Type": "multipart/form-data",
            "authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            const postModal = document.getElementById("exampleModal3");
            const modal = bootstrap.Modal.getOrCreateInstance(postModal);
            modal.hide();

            alert("Post added!");
            getPosts();

        })
        .catch(err => {
            console.error(err);
            alert(err);
        });
}
function postclick(id){
    
    window.location=`postdet.html?postid=${id}`
}
const urlparams=new URLSearchParams(window.location.search)
const id= urlparams.get("postid")


function getPost() {
    axios.get(`${apis}/posts/${id}`)
        .then((response) => {
            console.log(response.data); 
            
            const post = response.data.data;
            const comments = post.comments || [];
            const author = post.author;
            
            

            // author username
            document.getElementById("auth").innerHTML = author.username;

            // comments
            let Commentscontent = ``;
            for (let comment of comments) {
                Commentscontent += `
                <div class="comments" style="width:100%;">
                    <div class="p-3" style="background-color: rgb(226, 229, 228);">
                        <div>
                            <img src="postimg/amin.png" class="rounded-circle" style="width: 50px; height:40px;">
                            <b>${comment.author.username}</b>
                        </div>
                        <div>
                            ${comment.body}
                        </div>
                    </div>
                </div>`;
            }

            let imgSrc = (post.image && typeof post.image === "string")
                ? post.image
                : "postimg/default.jpg";

            let content = `
            <div class="card shadow my-2 d-flex justify-content-center" style="width:65%; margin-left:270px;">
                <div class="card-header">
                    <img src="postimg/amin.png" 
                         style="width:50px; height:50px;" 
                         class="rounded-circle border">
                    <b>${author.username}</b>
                </div>

                <div class="card-body" style="cursor: pointer;">
                    <img src="${imgSrc}" style="width:100%; height:500px;">
                    <h6 class="text-muted mt-1">${post.created_at}</h6>
                    <h5>${post.title}</h5>
                    <p>${post.body}</p>

                    <span>(${post.comments_count}) Comments</span>

                    <span id="tags-${post.id}"></span>
                </div>
            </div>

            ${Commentscontent}
            `;

            document.getElementById("post").innerHTML += content; 
        })
        .catch(err => console.error(err));
}

getPost();



