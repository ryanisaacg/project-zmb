const users = [
    {
        name: "Display Name",
        handle: "username",
        avi: "beach-ball.png",
    }
]

const posts = [
    {
        user: users[0],
        content: "Here's tweet text!",
        replies: [
            {
                user: users[0],
                content: "These tweets are now generated!",
            },
            {
                user: users[0],
                content: "Yup, just some JSON input and then it spits out all these HTML elements!",
            },
            {
                user: users[0],
                content: "Yup, just some JSON input and then it spits out all these HTML elements!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
            {
                user: users[0],
                content: "I'm a padding post to add length!",
            },
        ]
    }
]

const article = document.getElementsByTagName("article")[0]
console.log(article)
let active_post = 0
repaint()

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
    propic.src = post.user.avi
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
    display.innerHTML = post.user.name + ' '
    userinfo.appendChild(display)
    const handle = document.createElement("span")
    handle.className = "username"
    handle.innerHTML = '@' + post.user.handle
    userinfo.appendChild(handle)
    main.appendChild(userinfo)
    const text = document.createElement("div")
    text.className = "post-text"
    text.innerHTML = post.content
    main.appendChild(text)
    section.appendChild(main)
    return section;
}

