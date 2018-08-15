---
title: Building a Siteswap Visualizer in Elm 
layout: post
icon: source-fork
project_title: /juggling-graph
project_url: http://jbuckland.com/juggling-graph
github: http://github.com/ambuc/juggling-graph
tags: elm graphics javascript tool
---

* TOC
{:toc}

# Introduction

A few weeks ago [Josh Mermelstein](http://joshmermelstein.com/) approached me
with the idea to rewrite the [previous version of
/juggling-graph](https://github.com/ambuc/juggling-graph/tree/2c723ffe0bfa4db271c0ba95d2d5f453fc4e57ad)
(which had been written in CoffeeScript / d3.js) in something more extensible. 
He was/is writing a [siteswap suggestion
engine](http://joshmermelstein.com/juggle-suggest/); this tool would accept the
first few characters of a siteswap and return a few valid suggestions for
siteswaps. 

# What is Siteswap Notation?

> Siteswap is a juggling notation used to describe or represent juggling
> patterns. Siteswap may also be used to describe siteswap patterns, possible
> patterns transcribed using siteswap. It encodes the number of beats of each
> throw, which is related to their relative height, and the hand to which the
> throw is to be made... 

(from [Wikipedia](https://en.wikipedia.org/wiki/Siteswap))

Essentially, siteswap notation represents a displacement in time as a
displacement in space. Each character in the notation represents a time (and a
height); a throw `1` will land immediately, whereas a throw `3` will take three
beats to land.

        ┌-----┐
        ┴     v
    _ _ 3 _ _ _ _ _

# `/juggling-graph`

Here is how the new visualization engine would represent `333` in a linear view,
which reads left-to-right:

<center>
<img src="/images/juggling-graph/333.png"/>
</center>

And here's a circular view, which reads clockwise from the top:

<center>
<img src="/images/juggling-graph/333-circular.png"/>
</center>

Both versions of the visualization take advantage of the fact that these
patterns are cyclical; they are repeated over and over in time, so a throw of
length one from the last position in a siteswap will wrap back around and land
on the first position:

    _ _ _ _ _ 1 
    ^        ╰┬╯
    │         │
    └---------┘

So if a number is as long as the entire length of the pattern, its arrow will
_loop back on itself_.

On top of the initial complexity of throws-as-numbers, there are two
complicating factors:

## Multiplexes

Here's a more complex example: siteswap notation lets you encode a pattern like

<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Multiplex333_33.gif">
</center>

as `[333]33`.

The first group in brackets denotes a set of actions taken all at once. Each
`3`, both those inside and those outside brackets, denotes a throw which will
land three beats later. See if you can match the throws the above animation is
doing with the three groups in the siteswap:

     [333]   3   3
     ╰─┬─╯  ╰┬╯ ╰┬╯
       │     │   v
       │     │   Beat 3
       │     v
       │     Beat 2
       v
       Beat 1 (three throws at once)

Here is how the new visualization engine would represent `[333]33`:

<center>
<img src="/images/juggling-graph/33333.png"/>
</center>

And, for good measure, here's the circular view:

<center>
<img src="/images/juggling-graph/33333-circular.png"/>
</center>

Both views represent a multiplex as a shaded blue bar; each character within the
multiplex throws at the same time, and the entire multiplex has a single catch
point, which is drawn at its opening bracket.

One more complicating factor:

## Synchronous Throws

All of the above examples have been _async_; i.e. they have no preference which
hand you throw which ball with. Any of the examples could have been done with
two hands (as in the animation above) or just one hand.

Synchronous notation, like so:

    (left, right)(left,right)(left,right)

dictates which hand does which action at which beat.

In sync notation, each number is doubled, and adding an `x` to a value means
that its throw will cross hands -- from left to right, or right to left --
between throws.

So a siteswap like `([44x],[44x])` would look like this:

<center>
<img src="/images/juggling-graph/44x44x.png"/>
</center>

Or, as a circular view,

<center>
<img src="/images/juggling-graph/44x44x-circular.png"/>
</center>

# Elm

When I wrote the [previous version of
/juggling-graph](https://github.com/ambuc/juggling-graph/tree/2c723ffe0bfa4db271c0ba95d2d5f453fc4e57ad), 
I used CoffeeScript and d3.js. This time, I wanted to use
[Elm](http://elm-lang.org/), which I had heard about in the context of
[Haskell](http://jbuckland.com/tag/haskell). It turned out to be a joy to use,
both in terms of validating tricky index-counting arithmetic,
encapsulating an entire webapp in a small package, and providing a fast
javascript runtime.

Here are some notes on Elm. As with any language / development environment / MVC
framework, these are just the things which worked for me, not best practices.

## Compile/Build/Test Cycle

Since Elm compiles to javascript, I ended up writing a teeny faux
[makefile](https://github.com/ambuc/juggling-graph/blob/gh-pages/build.sh):

```bash
elm-make src/Main.elm --output=main.js
```

which encapsulated the [`elm-make`](https://github.com/elm-lang/elm-make) tool
with a constant destination. You could put this `./build.sh` command in a post-save
vim hook, for example.

I ended up writing a page `index.html` and integrating the compiled-in
`main.js` file by hand; this gave me a lot more control over the
[Materialize](http://materializecss.com) CSS framework, the positioning of the
component, etc. If I wanted Elm to be in charge of the entire webpage, styling,
routing, etc. I might have needed to change this. As-is, Elm can deliver a small
.js file for integration, or it can be the wholesale MVC framework, which I
really like.

## `/src`

Inside [`/src`](https://github.com/ambuc/juggling-graph/tree/gh-pages/src), the 
actual code ended up feeling pleasantly like Haskell. I encourage you to take a
poke around
[`/src/Types.elm`](https://github.com/ambuc/juggling-graph/blob/gh-pages/src/Types.elm),
which holds all the custom types which made sense in this context.

### `/src/Points.elm`

Because I ended up not using `d3.js`, I wanted to draw all the SVG by hand.
Drawing SVG lines/arrows/rectangles is pretty easy; all you need to know are the
coordinates of the points in question. I ended up needing to do some complex but
repetitive vector arithmetic, which meant defining

{% highlight haskell %}
type alias XY = { x : Float, y : Float }

(+.+) : XY -> XY -> XY
(+.+) a b =
    { x = a.x + b.x, y = a.y + b.y }

(+/+) : XY -> ( Float, Float ) -> XY
(+/+) a ( theta, dist ) =
    { x = a.x + dist * sin theta
    , y = a.y - dist * cos theta
    }
{% endhighlight %}

And some more convenience functions in
[`Points.elm`](https://github.com/ambuc/juggling-graph/blob/gh-pages/src/Points.elm)`.
This let me do complex geometry problems with some assurance that my mathematics
wouldn't quickly become unreadable.

### `/src/StateMachine.elm`

The rest of the code is straightforward: a utility for reading from input and
translating to instructions; a utility for executing those instructions and
rendering the arrows, lines, and rectangles. The most interesting of these steps
is the `StateMachine` module, which implements a parser which [Josh
Mermelstein](http://joshmermelstein.com/) designed.


# Parsing Siteswap Notation

Here we take a step back, out of Elm, into the realm of parsing/validating
siteswaps. Here are two state diagrams representing async / sync siteswap
notations. Each state (`S_SECOND_BRACE`, for example) truly represents the
state in which we are _waiting_ for the second brace. 

## Async Siteswap Parsing

Async siteswap parsing is simpler; there are only three states. Our `NORMAL`
state is one in which we read character after character; as long as they are
either numbers `0-9` or letters `a-z`, we know how to interpret them as throws.
(`a` means 10, `b` means 11, etc.) Otherwise, we have received an opening brace,
are in the middle of a brace, or have received a closing brace. Either way, we
know the set of valid characters at any state.

Because async siteswaps do not have nested braces, this is a relatively simple
problem.

<center>
<img src="/images/juggling-graph/async.png"/>
</center>

## Sync Siteswap Parsing

Sync siteswap parsing is considerably harder. We expect to read 

    ( -> _ -> , -> _ -> ) -> ( ... etc

where each `_` contains either a single valid character or a multiplex of valid
characters, and where each `_` may or may not be followed by an `x`. 

<center>
<img src="/images/juggling-graph/sync.png"/>
</center>

## In Elm

Writing this in Elm is not much harder than figuring it out in the first place.
We define a [type
`State`](https://github.com/ambuc/juggling-graph/blob/acc94fd90e78441b02c68554bae3de17c697e2e0/src/StateMachine.elm#L41-L58)
which is any one of the above states:

{% highlight haskell %}
type State
    = INIT
    | S_NORMAL
    | S_FIRST
    | S_FIRST_BRACE_EMPTY
    | S_FIRST_BRACE
    | S_FIRST_X_OR_BRACE
    | S_FIRST_X
    | S_COMMA
    | S_SECOND
    | S_SECOND_X
    | S_SECOND_BRACE_EMPTY
    | S_SECOND_BRACE
    | S_SECOND_X_OR_BRACE
    | S_PAREN
    | AS_NORMAL
    | AS_BRACE_EMPTY
    | AS_BRACE
{% endhighlight %}

and we use it to recursively consume a string of characters, generating a
series of partially-constructed throws, beats, lists of beats, and lists of
lists of beats.

At a low level, we represent [Throw](https://github.com/ambuc/juggling-graph/blob/acc94fd90e78441b02c68554bae3de17c697e2e0/src/Types.elm#L63-L69)s as structs:

{% highlight haskell %}
type alias Throw =
    { value : Int
    , hand : Hand
    , is_cross : Bool
    , is_valid : Bool
    , char : Char
    }
{% endhighlight %}

We represent a `Beat` as a list of `Throw`s with a validation bit; we represent
siteswaps as lists of lists of beats.

At each character in the input string, we have a current `State`, parse the
next character, see if it is valid, and then update the `State` and the
partially-constructed `parseObject` accordingly. (See the code [here](https://github.com/ambuc/juggling-graph/blob/acc94fd90e78441b02c68554bae3de17c697e2e0/src/StateMachine.elm#L158).)

# Rendering

Much of the difficulty of rendering the arrows came from the desire to not have
them overlap at their intersection points.

<center>
<img src="/images/juggling-graph/11.png"/>
</center>

See the way each arrow stops short to make room for the next one? In a linear
view this is easy; you see if the point you're approaching has an arrow
emerging from it (some don't!) and you draw your arrow to a point a uniform
height and width away.

    A rx ry x-axis-rotation large-arc-flag sweep-flag x y

SVG handles arc drawing like so: you must supply
  - an initial `(rx, ry)` point, 
  - a series of three boolean flags denoting 
		- whether the arc follows an ellipse whose minor axis is flat, or whose
      minor axis is parallel to the slope between the initial and final points,
    - whether the arc will take the short- or long-way round, and
    - whether the arc will begin moving at positive or negative angles, and
  - a final `(x,y)` destination.

Here is an example of the cross product of the `large-arc-flag` and the
`sweep-flag`:

<center>
<img src="https://developer.mozilla.org/@api/deki/files/345/=SVGArcs_Flags.png"/>
</center>

In actuality, these flags are easy to figure out -- the challenge of this
project often came from finding the xy coordinate of the destination point.

For the circular view, I wanted the arrow to appear to stop short along its
original path (whatever that might have been) between two points which are on a
large circle, but whose joining arrow traces the arc of another, smaller,
circle.




