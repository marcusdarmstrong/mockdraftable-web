// @flow

export default function (title: string, body: string, state: Object) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
  <title>${title}</title>
</head>
<body>
  <div id="react-container">${body}</div>
  <script>
    window.INITIAL_STATE = ${JSON.stringify(state)}
  </script>
</body>
</html>`;
}
