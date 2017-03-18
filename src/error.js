// @flow

export default (errorName: string) =>
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>${errorName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      text-align: center;
      font-size: 2rem;
    }
    img {
      width: 15rem;
    }
  </style>
</head>
<body>
  <a href="/"><img src="/public/icon.png" alt="MockDraftable" /></a>
  <p>${errorName}</p>
</body>
</html>`;
