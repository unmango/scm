{
  description = "unmango's source control infrastructure";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    systems.url = "github:UnstoppableMango/nix-systems";
    flake-parts.url = "github:hercules-ci/flake-parts";

    mangopkgs = {
      url = "github:unmango/pkgs";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-parts.follows = "flake-parts";
      inputs.systems.follows = "systems";
      inputs.treefmt-nix.follows = "treefmt-nix";
    };

    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [
        inputs.systems.flakeModule
        inputs.treefmt-nix.flakeModule
      ];

      perSystem =
        { inputs', pkgs, ... }:
        {
          devShells.default = pkgs.mkShellNoCC {
            packages =
              (with pkgs; [
                dprint
                gnumake
                nixfmt
                nodejs_24
                shellcheck
                pulumi-bin
                yarn
              ])
              ++ [ inputs'.mangopkgs.packages.graphify ];

            DPRINT = pkgs.dprint + "/bin/dprint";
            NIXFMT = pkgs.nixfmt + "/bin/nixfmt";
            NODE = pkgs.nodejs_24 + "/bin/node";
            PULUMI = pkgs.pulumi-bin + "/bin/pulumi";
            YARN = pkgs.yarn + "/bin/yarn";
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
            # programs.dprint.enable = true;
          };
        };
    };
}
