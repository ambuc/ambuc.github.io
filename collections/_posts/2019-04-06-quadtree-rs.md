---
title: Writing a Quadtree library for Rust
icon: account_tree

layout: post
---

{% include project.html 
   url="https://crates.io/crates/quadtree_rs" 
   github="http://github.com/ambuc/quadtree" %}

* TOC
{:toc}

# Introduction
I wrote and published a [quadtree](https://en.wikipedia.org/wiki/Quadtree) crate 
for Rust. It is published on [crates.io](https://crates.io/crates/quadtree_rs) 
and has docs on [docs.rs](https://docs.rs/quadtree_rs/0.1.2/quadtree_rs/). 

## What is a quadtree?

 > A quadtree is a tree data structure in which each internal node has exactly
 > four children. Quadtrees are the two-dimensional analog of octrees and are
 > most often used to partition a two-dimensional space by recursively
 > subdividing it into four quadrants or regions. The data associated with a
 > leaf cell varies by application, but the leaf cell represents a "unit of
 > interesting spatial information". - [Wikipedia](https://en.wikipedia.org/wiki/Quadtree)

![quadtree](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Point_quadtree.svg/240px-Point_quadtree.svg.png)

## What is a quadtree good for?

For graphics, visualization, and other applications which require spatial
information at a variable density, quadtrees are a good solution to the problem
of storing high-density location data without paying the cost of uniformly
high-density partitioning. As always, a picture says a thousand words:

[![representation](https://www.researchgate.net/profile/Marco_Sortino/publication/257444716/figure/fig1/AS:297523286691840@1447946487323/Comparison-between-Raster-and-Quadtree-representation-of-a-complex-shape.png)](https://www.researchgate.net/figure/Comparison-between-Raster-and-Quadtree-representation-of-a-complex-shape_fig1_257444716)

## Why did I write a quadtree library?

I found a [number](https://crates.io/search?q=quadtree) of quadtree
implementations on [crates.io](https://crates.io/). Some of them were simply too
outdated to work with modern Rust, some of them were too gamedev-specific, and
some were beyond my needs. 

Specifically, I wanted to be able to 
 - insert both points and regions,
 - insert mutliple overlapping regions in 2d space,
 - query by object handle and mutate the value (but not the location) in-place,
   and
 - later query a region and find all intersecting results. 

No library I found supported all these requirements.

# Implementation

The solution implemented in 
[`quadtree_rs`](https://crates.io/crates/quadtree_rs) makes a few compromises. 

First, value/region associations are cheap to insert, cheap to query, and
expensive to delete. This is ideal for gamedev, where a 2d map is constructed
once and then rendered frequently (such as on a per-frame basis). 

Second, regions are stored directly at the levels which describe them.

Here is what I mean: in a quadtree with _buckets_ (such as that illustrated in
the [Wikipedia article](https://en.wikipedia.org/wiki/File:Point_quadtree.svg),
points are bucketed, i.e a single node can have up to `n` values before it is
subdivided. (In the illustration, that bucket size appears to be one.)

In the `quadtree_rs` implementation, a handle (a key in some hashmap which
points to the user-inserved value) is inserted at multiple points in the
quadtree.

## Insert operations

Let's walk through inserting some points and regions to explore the design of
`quadtree_rs`.

### Inserting a point

Associating a value with a point, which is represented by a region with
dimensions 1x1, means traversing the full height of the quadtree.

Let's initialize a quadtree which covers the square region between $(0, 0)$ and
$(4, 4)$. The left column will be a tree respresentation, the middle column
will be a graphical representation, and the right column will be the data store.

```
tree                      graphical             data store
====                      =========             ==========

(0,0)->4x4                +---+---+---+---+
                          |               |
                          +               +
                          |               |
                          +               +
                          |               |
                          +               +
                          |               |
                          +---+---+---+---+
```

Now let's insert the value `'a'` at the point $(0, 0)$. In `quadtree_rs`, points
are regions with dimensions `1x1`.

We subdivide the quadtree twice. Inserting a point means traversing the full
_depth_ of the tree. 

If the quadtree were of depth `n`, the width and height of the region would be
`2^n`, and inserting a point would require `n` traversal steps.

We first insert `'a'` into the data store, returning the handle `001`. We then
insert `001` at each node in the tree which is wholly enclosed in the region
`(0, 0)->1x1`.

```
(0,0)->4x4                +---+---+---+---+      001 <=> 'a'
  (0,0)->2x2              |001|   |       |
    (0,0)->1x1 [001]      +---+   +       +
                          |       |       |
                          +---+---+       +
                          |               |
                          +               +
                          |               |
                          +---+---+---+---+
```

### Inserting a convenient region

Now let's insert the value `'b'` at a rectangular region anchored at $(0, 0)$
with dimensions `2x2`. 

We first insert `'b'` into the data store, returning the handle `002`. We then
insert `002` at each node in the tree which is wholly enclosed in the region
`(0, 0)->2x2`.

```
(0,0)->4x4                +---+---+---+---+      001 <=> 'a'
  (0,0)->2x2 [002]        |001|   |       |      002 <=> 'b'
    (0,0)->1x1 [001]      +---+   +       +
                          |    002|       |
                          +---+---+       +
                          |               |
                          +               +
                          |               |
                          +---+---+---+---+
```

Because there is a node which perfectly describes our insertion region, we only
insert the handle `002` once in the tree.

### Inserting an _inconvenient_ region

What happens if we insert a region which cannot be wholly described by a leaf
node?

Let's insert the value `'c'` at a rectangular region anchored at $(0, 0)$ with
dimensions `3x3`.

```
(0,0)->4x4                +---+---+---+---+      001 <=> 'a'
  (0,0)->2x2 [002,003]    |001|   |003|   |      002 <=> 'b'
    (0,0)->1x1 [001]      +---+   +---+---+      003 <=> 'c'
  (0,2)->2x2              |002,003|003|   |
    (0,2)->1x1 [003]      +---+---+---+---+
    (1,2)->1x1 [003]      |003|003|003|   |
  (2,0)->2x2              +---+---+---+---+
    (2,0)->1x1 [003]      |   |   |   |   |
    (2,1)->1x1 [003]      +---+---+---+---+
  (2,2)->2x2
    (2,2)->1x1 [003]
```

In the upper-left quadrant, the new region is described by the second-level leaf
node at `(0,0)->2x2`, so the handle (`003`) is inserted there. 

All other quadrants are subdivided until the division in question is either
wholly within or without the insertion region.

The handle type is lightweight, copyable, and can be inserted multiple times. A
handle type is used so that the actual value need not be copyable.

## Schema Conclusions

As a result of our handle-based design, insertion is fast and trivially
parallelizable (although that optimization is unimplemented). 

Querying means describing the region, deduping the set of handles, and looking
up each handle in the data store. 

Deleting means describing the region, collecting the set of affected handles,
and deleting those handles (and their associated values) from the data store.

# Caveats

There are a few problems with this implementation.

First, areas must have positive, nonzero dimensions. To avoid runtime
exceptions, we use the [derive_builder](https://docs.rs/derive_builder/) pattern
to derive an `AreaBuilder` type, which is somewhat verbose.

Second, coordinate types are subject to integer overflow. A client of this
library using `u8` types may experience hard-to-debug saturation effects at the
boundaries of their quadtree region.

Third, the quadtree requires a block of memory and is subject to frequent
reallocation. Thus a client of this library might want to describe the majority
of their canvas up-front.

# Conclusions

If you use this library (or want to) but it is unsuited for your application,
feel free to leave me a [github
issue](https://github.com/ambuc/quadtree/issues). I'm interested in
actively maintaining this library.
