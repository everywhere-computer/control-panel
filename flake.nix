{
  description = "everywhere.computer control panel";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
  };


  outputs = { nixpkgs, flake-utils, rust-overlay, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs { inherit system overlays; };


      in
      {
        devShells.default = pkgs.mkShell {
          name = "eccp";
          buildInputs = with pkgs;
            [ rust-bin.stable.latest.default nodejs ]
            ++ lib.optionals stdenv.isDarwin (with darwin.apple_sdk; [
              frameworks.Cocoa
              frameworks.Foundation
              frameworks.WebKit
            ]);
        };
      }
    );

}
