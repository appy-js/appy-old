# appy

A fully featured web framework for Deno.

> Notes:
>
> - For Window users, please use WSL2 as we won't be supporting Window natively
  > due to we wanna support various characters in the
  > [file-system based routing](https://honojs.dev/docs/api/routing/).

## Contributing

The project uses [nix](https://nixos.org/download.html) to manage the dev
environment tooling.

### How to run the example app

```sh
$ nix-shell
(nix-shell) appy $ example dev
```
