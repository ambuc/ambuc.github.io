---
title: Dotfiles
icon: scatter_plot
layout: post
---


* TOC
{:toc}

Here is a collection of dotfiles.

## How to compare all

```bash
# compare ~/.vimrc
diff --ignore-all-space ~/.vimrc (curl --silent https://gist.githubusercontent.com/ambuc/9ee68347c01bbc3e8af042deb190824f/raw/.vimrc | psub)
# compare ~/.tmux.conf
diff --ignore-all-space ~/.tmux.conf (curl --silent https://gist.githubusercontent.com/ambuc/aacc53d8eb7455d9c0bdcc0d0a2000ce/raw/.tmux.conf | psub)
# compare ~/.config/fish/config.fish
diff --ignore-all-space ~/.config/fish/config.fish (curl --silent https://gist.githubusercontent.com/ambuc/afd8fedff4ef7bb7080cb01e1c71ca9a/raw/config.fish | psub)
# compare ~/.gitconfig
diff --ignore-all-space ~/.gitconfig (curl --silent https://gist.githubusercontent.com/ambuc/0d6d4a0f559fa9a45e080de4043d36ad/raw/.gitconfig | psub)
```

## How to install all
``` bash
curl https://gist.githubusercontent.com/ambuc/9ee68347c01bbc3e8af042deb190824f/raw/.vimrc > ~/.vimrc
curl https://gist.githubusercontent.com/ambuc/aacc53d8eb7455d9c0bdcc0d0a2000ce/raw/.tmux.conf > ~/.tmux.conf
curl https://gist.githubusercontent.com/ambuc/afd8fedff4ef7bb7080cb01e1c71ca9a/raw/config.fish > ~/.config/fish/config.fish
curl https://gist.githubusercontent.com/ambuc/0d6d4a0f559fa9a45e080de4043d36ad/raw/.gitconfig > ~/.gitconfig
```

## Dotfiles

### `~/.vimrc`

<script src="https://gist.github.com/ambuc/9ee68347c01bbc3e8af042deb190824f.js"></script>

### `~/.tmux.conf`

<script src="https://gist.github.com/ambuc/aacc53d8eb7455d9c0bdcc0d0a2000ce.js"></script>

### `~/.config/fish/fish.config`

<script src="https://gist.github.com/ambuc/afd8fedff4ef7bb7080cb01e1c71ca9a.js"></script>

### `~/.gitconfig`

<script src="https://gist.github.com/ambuc/0d6d4a0f559fa9a45e080de4043d36ad.js"></script>
