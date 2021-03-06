const fs = require('fs')

uuid = 1

function handleFile(file) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      outputText = "{\n"
      data = data.replace(/\r/g, '').replace(/"/g, '\\"')
      data = data.split('-------------------------------------\n')
      users = data[0]
      posts = data[1]
      users = users.split('\n\n')
      outputText += `\t\"users\": [\n`
      users.forEach((user) => {
          user = user.split('\n')
          outputText += `\t\t{\n\t\t\t"name": "${user[0]}",\n`+
          `\t\t\t"handle": "${user[1]}",\n`+
          `\t\t\t"avi": "${user[2]}"\n\t\t},\n`
      })
      outputText = outputText.replace(/,\n$/, '\n')

      posts = posts.split('\n\n')
      outputText += `\t],\n\t"posts": [\n`
      posts.forEach((post) => {
          i = post.search(/@.+: \d+\/\d+/)
          initialPost = post.substring(0, i)
          replies = post.substring(i)

          i = initialPost.indexOf('\n')
          outputText += `\t\t{\n\t\t\t"UUID": ${uuid++},\n\t\t\t"user": "${initialPost.substring(1, i)}",\n`
          initialPost = initialPost.substring(i+1)

          votes = initialPost.split('\n')[0]
          try {
              outputText += `\t\t\t"upvotes": ${votes.split('/')[0]},\n`+
              `\t\t\t"downvotes": ${votes.split("/")[1].split(' ')[0]},\n`+
              `\t\t\t"tags": [\n`
          } catch(e) {
              console.log(post)
              throw e;
          }
          initialPost = initialPost.substring(initialPost.indexOf(' ')+1)
          tags = initialPost.substring(0, initialPost.indexOf('\n')).split(' ')
          outputText += `\t\t\t\t`
          tags.forEach((tag) => {
              outputText += `"${tag}", `
          });
          outputText = outputText.replace(/, $/, '\n')

          initialPost = initialPost.substring(initialPost.indexOf('\n')+1)

          outputText += `\t\t\t],\n`

          outputText += `\t\t\t"content": "${initialPost.replace(/\n$/, '').replace(/\n/g, '\\n')}",\n`+
          `\t\t\t"replies": [\n`

          replies = replies.replace(/\n@.+: \d+\/\d+/g, "delimeterthatshouldefinitelynotappearanywhereinthetextofourproject$&")
          replies = replies.split('delimeterthatshouldefinitelynotappearanywhereinthetextofourproject\n@')
          replies[0] = replies[0].substring(1)

          replies.forEach((reply) => {
              outputText += `\t\t\t\t{\n`
              i = reply.indexOf(': ')
              outputText += `\t\t\t\t\t"UUID": ${uuid++},\n\t\t\t\t\t"user": "${reply.substring(0, i)}",\n`
              reply = reply.substring(i + ': '.length)

              i = reply.indexOf('/')
              outputText += `\t\t\t\t\t"upvotes": ${reply.substring(0, i)},\n`
              reply = reply.substring(i + '/'.length)

              i = reply.indexOf(' ')
              outputText += `\t\t\t\t\t"downvotes": ${reply.substring(0, i)},\n`+
              `\t\t\t\t\t"tags": [\n`
              reply = reply.substring(i + ' '.length)

              i = reply.indexOf('\n')
              tags = reply.substring(0, i).split(' ')
              outputText += `\t\t\t\t\t\t`
              tags.forEach((tag) => {
                  outputText += `"${tag}", `
              });
              outputText = outputText.replace(/, $/, '\n')
              outputText += `\t\t\t\t\t],\n`

              outputText += `\t\t\t\t\t"content": "${reply.substring(i + '\n'.length, reply.length).replace(/\n$/, '').replace(/\n/g, '\\n')}"\n\t\t\t\t},\n`
          });
          outputText = outputText.replace(/,\n$/, '\n')

          outputText += `\t\t\t]\n`+
          `\t\t},\n`
      })
      outputText = outputText.replace(/,\n$/, '\n')

      outputText += `\t]\n}\n`

      fs.writeFile(file.replace('.txt', '.json'), outputText, (err) => {
        // In case of a error throw err.
        if (err) throw err;
      })
    })
}

fs.readdirSync('.').forEach((file) => {
    if(file.endsWith('-content.txt')) {
        handleFile(file)
    }
});
