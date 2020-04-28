const article = document.getElementsByTagName("article")[0]
const weekTitle = document.getElementById("week")

const slides = [
    {
        title: "Project ZMB",
        text: "Welcome to our entry in the Digital Decamaron! Your window into this fictional world is a basic social media site, like a proto-Twitter.",
    },
    {
        title: "How to Play",
        text: "Use the arrows to navigate the posts. (Please don't use your browser arrows!) Enjoy!",
        week: 1,
    },
    {
        title: "That's all, folks!",
        text: "Thanks for playing!",
    }
]

startSlide(0)

function startSlide(idx) {
    const { title, text, week } = slides[idx]
    weekTitle.innerHTML = title
    article.innerHTML = text
    document.getElementById("prev").classList.add("hidden")
    if(idx + 1 == slides.length) {
        document.getElementById("next").classList.add("hidden")
    }
    document.getElementById("next").onclick = function() {
        article.innerHTML = ''
        if(week) {
            startWeek(idx, week)
        } else {
            startSlide(idx + 1)
        }
    }

}

async function startWeek(slide, week) {
    const { users, posts } = await fetchJSON("week" + week + "-content.json")
    weekTitle.innerHTML = "Week " + week
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
        } else {
            startSlide(slide + 1)
        }
    }

    function repaint() {
        if(active_post == 0) {
            document.getElementById("prev").classList.add("hidden")
        } else {
            document.getElementById("prev").classList.remove("hidden")
        }
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
}

async function fetchJSON(url) {
    const response = await fetch(url, {mode: 'no-cors'})
    const json = await response.json()
    return json
}

