// @flow

export default (title: string, body: string, state: Object, jsBundle: string, cssBundle: string) =>
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <link rel="stylesheet" href="/${cssBundle}">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Arvo">
  <title>${title}</title>
</head>
<body>
  <div id="react-container">${body}</div>
  <script>
    window.INITIAL_STATE = ${JSON.stringify(state)}
  </script>
  <script src="/${jsBundle}"></script>
</body>
</html>`;
