# clan-operator

Planned repo: `unmango/clan-operator`.

## Description

[clan](https://clan.lol) manages fleets of NixOS machines through a CLI (`clan machines update`, `clan vars generate`, and so on) run by a person at a workstation.
clan-operator runs those commands on a clan's behalf, either as a controller in a Kubernetes cluster or as a service on a clan machine, and offers a dashboard of the machines and what ran against them.
It stays generic: it knows clans, not what the machines host.
The first consumer is cairn-operator, which sequences Kubernetes upgrades for [cairn](https://github.com/UnstoppableMango/cairn) clusters and hands each machine's `clan machines update` to clan-operator.

## Name

What it operates, after the `<thing>-operator` repos beside it.
