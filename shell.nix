{ pkgs ? import (builtins.fetchTarball {
  name = "nixpkgs-unstable-2023-01-01";
  url = "https://github.com/nixos/nixpkgs/archive/293a28df6d7ff3dec1e61e37cc4ee6e6c0fb0847.tar.gz";
  sha256 = "1m6smzjz3agkyc6dm83ffd8zr744m6jpjmffppvcdngk82mf3s3r"; # Hash obtained using `nix-prefetch-url --unpack <url>`
}) {} }:

with pkgs;

mkShell {
  buildInputs = [
    deno
    gnupg
    mysql
    postgresql
    sqlite
  ];

  shellHook =
    ''
      # Setup the terminal prompt.
      export PS1="(nix-shell) \W $ "
    '';
}
