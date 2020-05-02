const storage = window.localStorage;
const article = document.getElementsByTagName("article")[0]
const weekTitle = document.getElementById("week")
const progressContainer = document.getElementById("progress-container")
const progressBar = document.getElementById("progress-bar")

const slides = [
    {
        title: "Project ZMB",
        text: "Welcome to our entry in the Digital Decamaron! Your window into this fictional world is a basic social media site.",
    },
    {
        title: "How to Play",
        text: "Use the left and right arrows to navigate (not your browser's forward and back buttons!)",
    },
    {
        title: "Week 1",
        text: "Business as usual",
    },
    {
        week: 1,
    },
    {
        title: "Week 2",
        text: "Everything's fine, promise!",
    },
    {
        week: 2,
    },
    {
        title: "Week 3",
        text: "The situation is under control.",
    },
    {
        week: 3
    },
    {
        title: "Week 4",
        text: "Please don't panic.",
    },
    {
        week: 4
    },
    {
        title: "Week 5",
        text: "It's all falling apart.",
    },
    {
        week: 5
    },
    {
        title: "Week 6",
        text: "At least we tried.",
    },
    {
        week: 6
    },
    {
        title: "Week 7",
        text: "...",
    },
    {
        week: 7,
    },
    {
        title: "The End",
        text: "...",
    }
]

let slide = parseInt(storage.getItem('slide'), 10)
if(Number.isNaN(slide) || slide >= slides.length) {
    slide = 0;
}
startSlide(slide)

function startSlide(idx) {
    storage.setItem('slide', idx)
    storage.setItem('post', 0)
    progressContainer.classList.add("hidden")
    const { title, text, week } = slides[idx]
    document.getElementById("prev").classList.add("hidden")
    if(idx + 1 == slides.length) {
        document.getElementById("next").classList.add("hidden")
    }
    if(week) {
        article.innerHTML = ''
        startWeek(idx)
    } else {
        weekTitle.innerHTML = title
        article.innerHTML = '<h3>' + text + '</h3>'
        document.getElementById("next").onclick = function() {
            article.innerHTML = ''
            startSlide(idx + 1)
        }
    }
}

async function startWeek(slide) {
    const week = slides[slide].week
    progressContainer.classList.remove("hidden")
    const { users, posts } = await fetchJSON("week" + week + "-content.json")
    weekTitle.innerHTML = "Week " + week
    let active_post = parseInt(storage.getItem('post'), 10) || 0
    const post_map = {}
    const score_text_map = {}
    const arrows_map = {}
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
        let progress = (active_post + 1) / posts.length * 100;
        progressBar.style.width = progress + '%';
        storage.setItem('post', active_post)
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
        const unique_id = post.UUID
        post_map[unique_id] = post
        const section = document.createElement("section")
        section.className = "post"
        const propic = document.createElement("img")
        propic.width = 48;
        propic.height = 48;
        propic.className = "avi"
        const user = users.find(u => u.handle === post.user)
        propic.src = user.avi
        section.appendChild(propic)
        const arrows = document.createElement("div")
        arrows.className = "arrows"
        const uparrow = document.createElement("div")
        const downarrow = document.createElement("div")
        uparrow.className = "vote up"
        uparrow.innerHTML = "&uarr;"
        downarrow.className = "vote down"
        downarrow.innerHTML = "&darr;"
        const vote = storage.getItem("vote-" + unique_id)
        if(vote == "up") {
            uparrow.classList.add("active")
        } else if(vote == "down") {
            downarrow.classList.add("active")
        }
        uparrow.onclick = do_vote;
        downarrow.onclick = do_vote;
        uparrow.dataset.id = unique_id
        downarrow.dataset.id = unique_id
        arrows_map[unique_id] = [uparrow, downarrow]
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
        handle.innerHTML = '@' + user.handle + ' '
        userinfo.appendChild(handle)
        const score = document.createElement("span")
        score.className = "score"
        let diff = 0;
        if(vote == "up") {
            diff = 1;
        } else if(vote == "down") {
            diff = -1;
        }
        score.innerHTML = (diff + post.upvotes - post.downvotes) + " points"
        score_text_map[unique_id] = score
        userinfo.appendChild(score)
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

    function do_vote(event) {
        const target = event.target
        const id = event.target.dataset.id
        const post = post_map[id]

        const is_up = target.classList.contains('up')

        let change, vote
        if(target.classList.contains('active')) {
            target.classList.remove('active')
            change = 0
            vote = 'none'
        } else {
            arrows_map[id].forEach(arrow => arrow.classList.remove('active'))
            target.classList.add('active')
            change = is_up ? 1 : -1;
            vote = is_up ? 'up' : 'down'
        }
        storage.setItem('vote-' + id, vote)

        score_text_map[id].innerHTML = (change + post.upvotes - post.downvotes) + " points"
    }
}

async function fetchJSON(url) {
    const response = await fetch(url, {mode: 'no-cors'})
    const json = await response.json()
    return json
}

function devReset() {
    storage.clear()
}
