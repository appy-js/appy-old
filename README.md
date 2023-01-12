# appy

A fully featured web framework for Deno.

> Our goal is to deliver a web framework that provides similar DX like
> Rails/Django but with performance/observability kept in mind.

## Features

### Unstable

- CLI builder with built-in commands ready
- File-system based router with [Svelte](https://svelte.dev/) SSR support
  - the folder name is the route
    - index.svelte - the route's UI page (handling `GET` request)
    - index.ts - the route's `ALL/DELETE/HEAD/PATCH/POST/PUT/OPTIONS` request
      handlers

### Planned

- Authentication/Authorization support
- Graph-relational database with [EdgeDB](https://www.edgedb.com/)
- Background job processing with [EdgeDB](https://www.edgedb.com/)
- Remix way of
  [mutating data](https://remix.run/docs/en/v1/pages/philosophy#progressive-enhancement)
- Ready-to-use Svelte components (will be referencing to
  [Mantine](https://mantine.dev/) and [NextUI](https://nextui.org/))

> Notes:
>
> - For Window users, please use WSL2 as we won't be supporting Window natively
  > due to we wanna support various characters in the
  > [file-system based routing](https://honojs.dev/docs/api/routing/).
> - This project is still very early days, please do expect breaking changes.

## Contributing

The project uses [nix](https://nixos.org/download.html) to manage the dev
environment tooling. After you have installed it, please proceed to:

1. Enter `nix-shell`.

```sh
$ nix-shell
```

2. Run the example app.

```sh
(nix-shell) appy $ example dev
```

## Credits

- [CAC](https://github.com/cacjs/cac) for providing a simple yet powerful CLI
  framework
- [Deno](https://deno.land) for providing great DX in developing/running TS
  project
- [EdgeDB](https://edgedb.com/) for providing an extremely powerful relational
  DB library/tooling
- [ESBuild](https://esbuild.github.io/) for providing an extremely fast bundler
- [Hono](https://honojs.dev/) for providing an extremely powerful and performant
  HTTP router
- [Remix]
- [SvelteJS](https://svelte.dev/) for providing an extremely intuitive approach
  in building UI components/pages
