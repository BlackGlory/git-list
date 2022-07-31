# git-list
git-list is a tool for batch operation of git repositories,
it uses the `git-list.yaml` file in the current directory
as the single source of truth.

## Install
```sh
npm install -g @blackglory/git-list
# or
yarn global add @blackglory/git-list
```

## Usage
```
Usage: git-list [options] [command]

A tool for batch operation of git repositories

Options:
  -V, --version      output the version number
  --concurrency [n]  concurrency (default: "1")
  -h, --help         display help for command

Commands:
  clone              execute `git clone` on all of repositories in the list
  pull               execute `git pull` on all of repositories in the list
  push               execute `git push` on all of repositories in the list
  status             execute `git status` on all of repositories in the list
  purge [options]    delete all non-hidden directories and files that are not in the list
  help [command]     display help for command
```

## git-list.yaml
A YAML file with the array of URLs for repositories,
it is the single source of truth of git-list.

git-list maps the URL to the pathname of the repository.
For example, it map `git@example.com:owner/repo.git` to `example.com/owner/repo`,
so `git-list clone` means `git clone git@example.com:owner/repo.git github.com/owner/repo`.
