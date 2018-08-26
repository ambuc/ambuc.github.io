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
(which had been written in CoffeeScript / d3.js) with some new features, as part
of a [siteswap suggestion engine](http://joshmermelstein.com/juggle-suggest/).

# What is Siteswap Notation?

> Siteswap is a juggling notation used to describe or represent juggling
> patterns. Siteswap may also be used to describe siteswap patterns, possible
> patterns transcribed using siteswap. It encodes the number of beats of each
> throw, which is related to their relative height, and the hand to which the
> throw is to be made... 

(from [Wikipedia](https://en.wikipedia.org/wiki/Siteswap))

Siteswaps represent displacement in time and space. Each character in a siteswap
represents the time and height of a particular throw. A throw "`1`" will land on
the next beat. A throw "`3`" will take three beats to land.

        ╭-╮     ||       ╭-----╮
        | v     ||       |     v
    _ _ 1 _ _   ||   _ _ 3 _ _ _ _ _

So a sequence like "`333`" would mean 

  - on the 1st beat, throw a ball high enough that it takes three beats to land,
  - on the 2nd beat, throw a ball high enough that it takes three beats to land,
  - on the 3rd beat, throw a ball high enough that it takes three beats to land.

You might have noticed that this description demands three unique balls.
`juggling-graph` is a way to visualize the number of unique balls in a siteswap,
and the path each ball takes between beats.

# `/juggling-graph`

Here is how `juggling-graph` renders "`333`":

<center>
<img src="/images/juggling-graph/333.png"/>
</center>

Since siteswap patterns are meant to be repeated, you could really have depicted
"`333`" as a repeated notation: "`333, 333, 333...`". So, Josh and I thought it
would be interesting to render this in a circular view. (Read clockwise from the
top.)

<center>
<img style="max-width: 400px;" src="/images/juggling-graph/333-circular.png"/>
</center>

Because the notation is cyclic, a throw from the end of a pattern will loop back
around to its start.

            ╭-╮       ╭-------╮          ╭-----╮
            | v       v       |          v     |
    _ _ _ _ 1 _       _ _ _ _ 2 _      _ _ _ _ 3 _
    1 2 3 4 5 6       1 2 3 4 5 6      1 2 3 4 5 6

This is made evident with some modulo arithmetic: 

        v                 v                v
    5 + 1 = 6         5 + 2 = 7        5 + 3 = 8
    6 % 6 = 6         7 % 6 = 1        8 % 6 = 2
            ^               ^                ^

And a number equal to the length of the total pattern will loop back around to
itself.

                      ╭------╮
                      v      |
    1 _ _    2 _ _    3 _ _  |
    | ^      |   ^    |      |
    ╰-╯      ╰---╯    ╰------╯

Sadly, there are two more things to learn about siteswaps:

## Multiplexes

What happens if you perform more than one throw at a time?

We can encode multiple throws inside the same beat by putting them together in
brackets. Take the pattern "`[333]33`":

     [333]   3   3
     ╰-┬-╯  ╰┬╯ ╰┬╯
       │     │   Beat 3
       │     Beat 2
       Beat 1 

All '`3`'s, both inside and outside a bracket, denote a throw which will land
three beats later.

Here is how `juggling-graph` represents "`[333]33`" in normal and circular view:

<center>
<img src="/images/juggling-graph/33333.png"/>
</center>

<center>
<img src="/images/juggling-graph/33333-circular.png"/>
</center>

And here's a gif of "`[333]33`", since it's hard to picture:

<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Multiplex333_33.gif">
</center>

Both views represent a multiplex as a blue bar. Each character within the
multiplex throws at the same time, and the entire multiplex has a single catch
point (the opening bracket).

One more complicating factor:

## Synchronous Throws

All of the above examples have been _async_; i.e. they have no preference which
hand you throw which ball with. Any of the examples could have been done with
two hands (as in the animation above) or just one hand.

But we can dictate which hand does which action with _synchronous_ notation, like so:

    (left, right)(left,right)(left,right)

One more complexity -- in sync notation, each number is doubled. Also,  adding an
`x` to a value means that its throw will cross hands between throws.

So a siteswap like `([44x],[44x])` would look like this:

<center>
<img src="/images/juggling-graph/44x44x.png"/>
</center>

Or, as a circular view,

<center>
<img src="/images/juggling-graph/44x44x-circular.png"/>
</center>

# Using Elm

When I wrote the [previous version of
`juggling-graph`](https://github.com/ambuc/juggling-graph/tree/2c723ffe0bfa4db271c0ba95d2d5f453fc4e57ad), 
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

{% highlight bash %}
elm-make src/Main.elm --output=main.js
{% endhighlight %}

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

The code feels pleasantly like Haskell. I encourage you to take a poke around
[`/src`](https://github.com/ambuc/juggling-graph/tree/gh-pages/src) and
particularly the part in which I define custom types:
[`/src/Types.elm`](https://github.com/ambuc/juggling-graph/blob/gh-pages/src/Types.elm).

### `/src/Points.elm`

I wanted to draw all the SVG by hand. This involved some complex but repetitive
vector math, for which I ended up defining cartesian and polar addition
functions:

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

There are more geometry bits in 
[`Points.elm`](https://github.com/ambuc/juggling-graph/blob/gh-pages/src/Points.elm)`.

### `/src/StateMachine.elm`

The rest of the code is straightforward: we expect

  - a utility for reading from input and translating to instructions
  - a utility for executing those instructions and rendering the arrows, lines,
    and rectangles. 

The most interesting of these steps is the `StateMachine` module, which
implements a parser which [Josh Mermelstein](http://joshmermelstein.com/)
designed.

# Parsing Siteswap Notation

It makes sense to read an input one character at a time, building a valid
siteswap along the way. To follow an arrow between states, the next character
must match the range printed on that arrow. Furthermore, each state is named for
the input it expects to receive next. (For example, "`S_SECOND_BRACE`" represents
a state in which we are waiting for a second brace.)

Here are two state diagrams representing async / sync siteswap notations. 

## _Async_ Siteswap Parsing

_Async_ parsing is the simpler of the two; there are only three states:

 - In our "`NORMAL`" state, each input in the range "`0-9a-z`" denotes a throw
   - ('`a`' = 10, '`b`' = 11, etc.)
 - An open bracket '`[`' means we should now expect throws inside a multiplex
   ('`A_BRACE_EMPTY`'), and
 - A closed bracket '`]`' means we have now left. (Back to "`NORMAL`".)

This is probably best explained by a state transition diagram.

<center>
<img src="/images/juggling-graph/async.png"/>
</center>

## _Sync_ Siteswap Parsing

Sync siteswap parsing is considerably harder. 

<center>
<img class="fullwidth" src="/images/juggling-graph/sync.png"/>
</center>

## Writing a State Machine in Elm

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

and we use it to consume a string of characters. Along the way, we generate a
partially-constructed structure beats and throws within them.

At a low level, we represent
[Throw](https://github.com/ambuc/juggling-graph/blob/acc94fd90e78441b02c68554bae3de17c697e2e0/src/Types.elm#L63-L69)s
as structs:

{% highlight haskell %}
type alias Throw =
    { value : Int     -- the value of a throw,
    , hand : Hand     -- which hand it was thrown with,
    , is_cross : Bool -- whether or not it is a 'crossing' throw,
    , is_valid : Bool -- whether or not it is a valid throw, and
    , char : Char     -- the underlying character from which it was parsed.
    }
{% endhighlight %}

We represent a `Beat` as a list of `Throw`s with a validation bit; we represent
siteswaps as lists of lists of beats.

{% highlight haskell %}
type alias Beat =
    { is_valid : Bool
    , throws : List Throw
    }
{% endhighlight %}

At each character in the input string, we have an in-progress `State`. We parse
the next character, see if it is valid, and then update the `State` and the
partially-constructed `parseObject` accordingly. (See the code [here](https://github.com/ambuc/juggling-graph/blob/acc94fd90e78441b02c68554bae3de17c697e2e0/src/StateMachine.elm#L158).)

# Rendering

Much of the difficulty of rendering the arrows came from the desire to not have
them overlap at their intersection points.

<center>
<img class="border" src="/images/juggling-graph/11.png"/>
</center>

See the way each arrow stops short to make room for the next one? In a linear
view this is easy; you see if the point you're approaching has an arrow
emerging from it (some don't!) and you draw your arrow to a point a uniform
height and width away.

    A rx ry x-axis-rotation large-arc-flag sweep-flag x y
      ----- --------------- -------------- ---------- ---
        1          2               3            4      5

To render an arc, you must supply:

 - 1) an initial `(rx, ry)` point,
 - 2) whether the arc follows an ellipse whose minor axis is flat, or whose
   minor axis is parallel to the slope between the initial and final points,
 - 3) whether the arc will take the short- or long-way round, and
 - 4) whether the arc will begin moving at positive or negative angles, and
 - 5) a final `(x,y)` destination.

For the circular view, I wanted the two points $A$ and $B$ (who lie on a large
circle with a center at $O$) to be joined by a curved arrow which would trace
the path of a smaller circle (with a center at $C$). Furthermore, I wanted that
arrow to stop short at a set radius $r_A$ from the destination point.

<center>
<img src="/images/juggling-graph/tikz/circle.png"/>
</center>

To see how this was handled, see
[`Draw.mkThrowCircular`](https://github.com/ambuc/juggling-graph/blob/gh-pages/src/Draw.elm#L305-L359).

# Conclusion

This project ended up being a fun bit of geometry and parsing and
a whole lot of diving into a new (but familiar) language. I encourage you to
check out [the project](http://jbuckland.com/juggling-graph/) yourself and play
around with the
**Random** button.

