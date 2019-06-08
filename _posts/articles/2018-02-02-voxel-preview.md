---
title: OSC-Responsive 3D Graphics in Rust
layout: post
icon: draw-polygon
github: https://github.com/ambuc/voxel-preview
categories: [articles]
tags: rustlang graphics
---

* TOC
{:toc}

# Introduction 

As preparation for an upcoming hardware-intensive project involving an [8x8x8
LED cube
display](https://www.aliexpress.com/item/DIY-3D8-multicolor-mini-LED-light-display-Excellent-animation-3D-8-8x8x8-Electronic-Kits-Junior/32700909987.html),
We want a way to preview the behavior of the display remotely. Enter
`voxel-preview`: like the intended physical display, the rendered cube listens
over UDP for [OSC packets](http://opensoundcontrol.org/) and updates the voxels
accordingly.

## Requirements
 - Rust and Cargo, ideally by way of [Rustup](https://www.rustup.rs/)
 - [`send_osc`](manpages.ubuntu.com/manpages/xenial/man1/send_osc.1.html) for
   testing

## Installation
`voxel-preview` can be downloaded, built, and run with `cargo`. 

    $ git clone https://github.com/ambuc/voxel-preview.git
    $ cd voxel-preview
    $ cargo build 

## Usage

    $ cargo run

At this point, an OpenGL window will pop up and show a slowly-revolving rainbow
cube; the default dimensions are 8x8x8.

<img src="https://raw.githubusercontent.com/ambuc/voxel-preview/master/render.png" width="70%" >

You can send individual packets with
[`send_osc`](http://manpages.ubuntu.com/manpages/xenial/man1/send_osc.1.html).
`voxel-preview` listens on `127.0.0.1:1234` by default.

## Schema
The schema is:

    //       port  x y z r   g   b
    send_osc 1234 /0/2/4 0.0 0.5 1.0

where `x`, `y`, and `z` are the xyz coordinates of the voxel to color, and `r`,
`g`, and `b` are the rgb coordinates thereof. 

`voxel-preview` will drop malformed packets within reason (`x` > `CUBE_WIDTH`,
or `r` > 1.0, for example), but it's not _that_ smart.

# Conclusion

This isn't so much a project as a tool. We aim to write a controller which
interfaces nicely with something like
[TouchOSC](https://itunes.apple.com/us/app/touchosc/id288120394?mt=8), which
will ultimately serve as a sort of platform for a series of abstract 3D games /
toys / visualizations over the coming weeks or months.

