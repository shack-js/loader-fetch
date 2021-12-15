# loader-fetch

fetch loader for shack.js, it converts `direct api function call` into `http fetch` codes

shack.js doc here: https://github.com/shack-js/shack.js/blob/main/README.md

in case you want to use webpack rather than shack.js, here is a webpack config example:

```
module:{
  rules:[
    ...
    {
      test: /[\/|\\]apis[\/|\\].*\.((m|c)?jsx?|tsx?)$/,
      use: {
        loader: '@shack-js/loader-fetch',
        options: {
          apiPrefix: '/apis',
          backendFolder: 'apis',
          sourceType: 'module'
        }
      }
    }
```

try on codesandbox: https://codesandbox.io/s/shack-js-loader-fetch-example-dek39