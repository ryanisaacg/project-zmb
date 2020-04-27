const fs = require('fs')

fs.readFile('content.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  outputText = "{\n"
  data = data.replace(/\r/g, '')
  data = data.split('-------------------------------------\n')
  users = data[0]
  posts = data[1]
  users = users.split('\n\n')
  outputText += "\t\"users\": [\n"
  users.forEach((user) => {
      user = user.split('\n')
      outputText += `\t\t{\n\t\t\t"name": "${user[0]}",
      \t\t"handle": "${user[1]}",
      \t\t"avi": "${user[2]}"\n\t\t},\n`
  })
  outputText = outputText.replace(/,\n$/, '\n')

  posts = posts.split('\n\n')
  outputText += `\t],\n\t"posts": [\n`
  posts.forEach((post) => {
      i = post.search(/@.+: \d+\/\d+/)
      initialPost = post.substring(0, i)
      replies = post.substring(i)

      i = initialPost.indexOf('\n')
      outputText += `\t\t{\n\t\t\t"user": "${initialPost.substring(1, i)}",\n`
      initialPost = initialPost.substring(i+1)

      votes = initialPost.split('\n')[0]
      outputText += `\t\t\t"upvotes": ${votes.split('/')[0]},
      \t\t"downvotes": ${votes.split("/")[1]},\n`
      initialPost = initialPost.substring(initialPost.indexOf('\n')+1)

      outputText += `\t\t\t"content": "${initialPost.replace(/\n$/, '').replace(/\n/g, '\\n')}",
      \t\t"replies": [\n`

      // TODO: This has a problem where if a reply includes a newline + @ someone, it will be split as a separate reply
      replies = replies.split('\n@')
      replies[0] = replies[0].substring(1)

      replies.forEach((reply) => {
          outputText += `\t\t\t\t{\n`
          i = reply.indexOf(': ')
          outputText += `\t\t\t\t\t"user": "${reply.substring(0, i)}",\n`
          reply = reply.substring(i + ': '.length)

          i = reply.indexOf('/')
          outputText += `\t\t\t\t\t"upvotes": ${reply.substring(0, i)},\n`
          reply = reply.substring(i + '/'.length)

          i = reply.indexOf('\n')
          outputText += `\t\t\t\t\t"downvotes": ${reply.substring(0, i)},
          \t\t\t"content": "${reply.substring(i + '\n'.length, reply.length).replace(/\n$/, '').replace(/\n/g, '\\n')}"\n\t\t\t\t},\n`
      });
      outputText = outputText.replace(/,\n$/, '\n')

      outputText += `\t\t\t]
      \t},\n`
  })
  outputText = outputText.replace(/,\n$/, '\n')

  outputText += `\t]\n}`

  fs.writeFile('content.json', outputText, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  })
})
