[![Link](https://github.com/yegorrybchenko/go-swag-action/workflows/build-test/badge.svg "Actions status")](https://github.com/yegorrybchenko/go-swag-action/actions)

# Swag tool for golang applications

This action installs [swag](https://github.com/swaggo/swag) tool to generate/test your golang application

## Features

- Installing swag tool (by default)
- Executing swag tool with your parameters. Can generate swagger documentation
- Comparing generated documentation with commited. Works only for generated `docs.go` files

## Inputs

## `swagVersion`

**Required** The version of swag tool you want to install. Version is taken from [swag releases](https://github.com/swaggo/swag/releases).

## `command`

Command you want to execute. Command is passed as arguments to swag tool.

## `equalToGoPath`

Specifies a path to `docs.go` file you want to compare with your commited **docs.go** file. Commited file is specified by `equalToGoOriginPath` parameter.

## `equalToGoOriginPath`

Specifies a path to **docs.go** file commited in the repository. Works only if `equalToGoPath` option is specified. Default is `docs/docs.go`.

## Example usage

We want to generate docs.go file and compare with commited.

It's an example from current repository. Go project is taken from <https://github.com/swaggo/swag/tree/master/example/celler>

```text
- uses: yegorrybchenko/go-swag-action@v0.1
  with:
    command: init -d example_test -ot go
    swagVersion: 1.8.1
    equalToGoPath: docs/docs.go
    equalToGoOriginPath: example_test/docs/docs.go
```

## Contributing

1. Fork the repository
2. Create new branch
3. Commit to the new branch
4. Create new pull request

### Building the project

Run build-package before the push

```bash
npm run build-package
```
