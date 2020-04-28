async function fetchJSON(url) {
    const response = await fetch(url, {mode: 'no-cors'})
    const json = await response.json()
    return json
}

var users
var posts
fetchJSON('week1-content.json').then((json) => {
    const { users, posts } = json

    for(var i = 0; i < 50; i++) {
        posts[0].replies.push(posts[0].replies[0])
    }

    const article = document.getElementsByTagName("article")[0]
    console.log(article)
    let active_post = 0
    repaint()

    document.getElementById("prev").onclick = function() {
        if(active_post > 0) {
            active_post -= 1;
            repaint();
        }
    }

    document.getElementById("next").onclick = function() {
        if(active_post + 1 < posts.length) {
            active_post += 1;
            repaint();
        }
    }

    function repaint() {
        while(article.children.length > 0) {
            article.children[0].remove();
        }
        const post = posts[active_post];
        article.appendChild(create_post(post))
        const replies = document.createElement("section")
        replies.className = "replies"
        post.replies.forEach(reply => replies.appendChild(create_post(reply)))
        article.appendChild(replies)
    }

    function create_post(post) {
        const section = document.createElement("section")
        section.className = "post"
        const propic = document.createElement("img")
        propic.className = "avi"
        const user = users.find(u => u.handle === post.user)
        propic.src = user.avi
        section.appendChild(propic)
        const arrows = document.createElement("div")
        arrows.className = "arrows"
        const uparrow = document.createElement("span")
        const downarrow = document.createElement("span")
        uparrow.className = "vote"
        uparrow.innerHTML = "&uarr;"
        downarrow.className = "vote"
        downarrow.innerHTML = "&darr;"
        arrows.appendChild(uparrow)
        arrows.appendChild(downarrow)
        section.appendChild(arrows)
        const main = document.createElement("div")
        main.className  = "post-main"
        const userinfo = document.createElement("div")
        userinfo.className = "userinfo"
        const display = document.createElement("span")
        display.className = "display-name"
        display.innerHTML = user.name + ' '
        userinfo.appendChild(display)
        const handle = document.createElement("span")
        handle.className = "username"
        handle.innerHTML = '@' + user.handle
        userinfo.appendChild(handle)
        main.appendChild(userinfo)
        const text = document.createElement("div")
        text.className = "post-text"
        for(let line of post.content.split("\n")) {
            const paragraph = document.createElement("span");
            paragraph.innerHTML = line
            text.appendChild(paragraph);
            text.appendChild(document.createElement("br"));
        }
        main.appendChild(text)
        section.appendChild(main)
        return section;
    }
});
