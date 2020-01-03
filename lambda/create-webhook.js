const https = require('https')

exports.handler = function(event, context) {
  // https://lambda/?code=xxx&state=
  // If this is the initial request.
  if (event.httpMethod === 'GET' && event.queryStringParameters.code) {
    // Retrieve the initial auth
    // https://slack.com/api/oauth.access?client_id&client_secret&code
    let { client_id, client_secret } = process.env

    const optionspost = {
      host: 'slack.com',
      path: `/api/oauth.access?client_id=${client_id}&client_secret=${client_secret}&code=${
        event.queryStringParameters.code
      }`,
      method: 'GET'
    }

    let body = ''

    var reqPost = https
      .request(optionspost, function(res) {
        res.on('data', function(chunk) {
          body += chunk
        })

        res.on('end', function() {
          let jsonStr = JSON.parse(body)

          // {"ok":true,
          // "access_token":"xoxp-xxx-xxx-xxx",
          // "scope":"identify,incoming-webhook,chat:write:bot",
          // "user_id":"xxx","team_name":"xxx","team_id":"xxx"}
          if (jsonStr.ok) {
            // context.succeed({
            //     'statusCode': 200,
            //     body: JSON.stringify({'ok': true, 'access_token': jsonStr.access_token}),
            // })
            context.succeed({
              statusCode: 301,
              headers: {
                Location: `https://juliuscc.github.io/semantic-release-slack-bot/index.html?access_token=${
                  jsonStr.access_token
                }`
              }
            })
          } else {
            context.succeed({
              statusCode: 401,
              body: JSON.stringify({
                ok: false,
                message: 'Invalid credentials'
              })
            })
          }
        })
      })
      .on('error', function(e) {
        context.succeed({
          statusCode: 500,
          body: JSON.stringify({
            ok: false,
            message: 'Could not connect to slack.'
          })
        })
      })

    reqPost.write('')
    reqPost.end()
  } else {
    context.succeed({
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'Invalid request.' })
    })
  }
}
