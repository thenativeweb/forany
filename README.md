# forany

forany runs a command on every directory.

## Installation

```bash
$ npm install -g forany
```

## Quick start

To run a command on every directory, run `forany` and provide the command as a parameter. If the command contains spaces, you need to wrap it within quotes.

```bash
$ forany 'git push'
```

By default, the command will be run silently. If you actually want to see the output of the command, additionally provide the `--verbose` option.

```bash
$ forany 'git status' --verbose
```

### Setting the default values

If you want to configure forany permanently, e.g. so that it always runs in verbose mode, create a `~/.forany.json` file in your home directory with the following structure.

```json
{
  "noColor": false,
  "verbose": true
}
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```bash
$ bot
```

## License

The MIT License (MIT)
Copyright (c) 2015-2017 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
