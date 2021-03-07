---
title: Puzzle Pong - Irreversible Cube II
icon: extension_off

layout: post
---

{% include project.html 
  github="https://gist.github.com/ambuc/4b2de70b09e139dc5901bf960f14e166"
  %}

* TOC
{:toc}

# The Puzzle

This  is a continuation of [Puzzle Pong -  Irreversible Cube
I](http://jbuckland.com/irreversible/).  In the first part, [Josh
Mermelstein](http://joshmermelstein.com/) posed me a series of questions about
the Irreversible Cube: 

> Oskar van Deventer [{1}](https://www.youtube.com/user/OskarPuzzle/) presents 
> an Irreversible Cube in his 2013 video 
> [{2}](https://www.youtube.com/watch?v=eMGeKdog8Ws) which is an ordinary 2x2x2 
> Rubix Cube where you are only allowed to turn any face clockwise, and only 
> once in a row.

![1](/assets/images/irreversible-i/cube1.jpg)

By the [end of part 1)](http://jbuckland.com/irreversible/#conclusions), I had a
fairly poor approximation of an isometric projection, which was  able to take a
set of points and turn them into tilted tiles along one of three skew planes.
This was pretty good for seeing what state the cube might be in at any given
stage, but it was not a true 3D rendering, meaning that my higher goals of
animating a real turn were next-to-impossible.

This inspired a separate Haskell library, [Cornea](https://github.com/ambuc/cornea) for
isometric 3D graphing and rendering, which I discuss
[here](http://jbuckland.com/isometric/). Cornea has the benefit of being easily
mapped to write out either a single image or a series of images, which can be
stitched together into [animations](http://jbuckland.com/isometric/#animation).

In this post, I'll discuss wrapping the Irreversible Cube solver from part I
into something which can render animations of the cube in  the process of being
solved.

# Changes

Recall our custom type definitions:

```haskell
data Side        = F | B | U | D | L | R deriving (Eq, Bounded, Show, Enum, Ord)
data Axis        = X | Y | Z deriving (Eq, Show)
data Cardinality = Pos | Neg deriving (Eq, Show)
type Rotation    = (Coord -> Coord)
type Coord       = [Int]
type Tile        = Coord
type Cube        = [Tile]
```

The biggest change we must make from the old way of doing things is to
rewrite `mkRot :: Cardinality -> Axis -> Rotation` to rely on a much more
general `rotate :: Float -> Axis -> [x,y,z] -> [x',y',z']` under the hood. That
way, we can still do things like

    given a turn on face  L 
    -> run through sideToCardinalityAndAxis s2CA(L) = (Neg, Y) 
    -> get cardinality Neg and axis Y
    -> mkRot Neg Y -> (\[x,y,z] -> rotate (-90) Y [x,y,z])

Or, when we need to start calculating in-between frames (tweens) for our side
rotation animation, we can do things like

    rotateFace :: Float -> Axis -> Obj -> Obj
    rotateFace <angle> <axis> (Face pts) = Face (map (rotate <angle> <axis>) pts)

Here's the code that  makes that happen.

```haskell
mkRot :: Cardinality -> Axis -> Rotation
mkRot c a = map (\x -> round x :: Int) . rotate (toAngle c) a . map fromIntegral

s2Rot :: Side -> Rotation
s2Rot = uncurry mkRot . s2CA

s2CA :: Side -> (Cardinality, Axis)
s2CA F = (Pos, X); s2CA R = (Pos, Y); s2CA U = (Pos, Z); 
s2CA B = (Neg, X); s2CA L = (Neg, Y); s2CA D = (Neg, Z);

rotate :: Float -> Axis -> [Float] -> [Float]
rotate t X [x,y,z] = [ x                     , cos t * y - sin t * z ,  sin t * y + cos t * z]
rotate t Y [x,y,z] = [ cos t * x + sin t * z , y                     , -sin t * x + cos t * z]
rotate t Z [x,y,z] = [ cos t * x - sin t * y , sin t * x + cos t * y ,  z                    ]

rotateFace :: Float -> Axis -> Obj -> Obj
rotateFace t a (Face pts) = Face (map (rotate t a) pts)

toAngle :: Cardinality -> Float
toAngle Pos =  pi/2; toAngle Neg = -pi/2

```

Now we can just write `twist` as 

```haskell
twist :: Side -> Cube -> Cube
twist side = map (\x -> if side `sees` x then s2Rot side x else x)

sees :: Side -> (Coord -> Bool)
(sees) F = (>0) . (!!0); (sees) R = (>0) . (!!1); (sees) U = (>0) . (!!2);
(sees) B = (<0) . (!!0); (sees) L = (<0) . (!!1); (sees) D = (<0) . (!!2);
```

# Seqeuence of Moves

As for the algorithm, `seed` and `kids` stay the same; we end up producing the
sequence of moves the same way with the same call.

```haskell
moves = reverse $ snd $ head $ filter (solved.fst) $ concat 
      $ iterate (concatMap kids) seed
```

# Rendering a Cube

Things have changed a little bit; instead of projecting squares and
skewing/translating them, we have  to actually describe the four corner
coordinates of a tile in able to render it in 3d space. 

Recall that we store `Tile`s as 3-tuples  describing the center of the tile in
question; if a tile is on the top face  of the  cube, it will have coordinates
$(\pm 1, \pm 1, +2)$, etc. Tiles don't come bundled with normal vectors
describing their face orientation, so there's nothing to it here but to
hard-code this logic.

```haskell
toTile :: [Int] -> Obj
toTile [x,y,z] = p2t' [fromIntegral x, fromIntegral y, fromIntegral z]
  where p2t' [ x, y, 2] = Face [ [x+a, y+b,  n] | (a,b) <- rg ]
        p2t' [ x, y,-2] = Face [ [x+a, y+b, -n] | (a,b) <- rg ]
        p2t' [ x, 2, z] = Face [ [x+a,  n, z+b] | (a,b) <- rg ]
        p2t' [ x,-2, z] = Face [ [x+a, -n, z+b] | (a,b) <- rg ]
        p2t' [ 2, y, z] = Face [ [ n, y+a, z+b] | (a,b) <- rg ]
        p2t' [-2, y, z] = Face [ [-n, y+a, z+b] | (a,b) <- rg ]
        rg :: Num a => [(a,a)]
        rg = [(1,1),(1,-1),(-1,-1),(-1,1)] --range
        n = 5 --offset
```

We use `n` as a way to control how "exploded" the cube is; at the beginning I
rendered cubes as `n=2` to draw the cube realistically; later we can tune it up
to explode the cube more and more.

# Animation

We have a couple of options here; let's start simple and work our way up in
complexity.

We can `scanr` and sequentially apply   `moves` over a `solvedCube` to get a
sequence of cubes in various staged of solved-ness. 

If we write `toImage <cube> <viewpoint>` to return an `Image px` of the cube
(zipped with our custom `kolors` color-sequence), 

```haskell
toImage :: [Obj] -> (Float, Float) -> Image PixelRGBA8
toImage cs v = render 500 500 40 $ world `seenFrom` v
  where world = map (second solid) $ zip cs kolors
```

Then we can write an `animate` function. In this case, because we want to do our
styling  in `toImage`, we only need an array of `[Obj]`s as our input. `animate`
accepts a series of cubes, a series of viewpoints, and a series of filenames:

```haskell
animate :: [[Obj]] -> [(Float,Float)] -> [String] -> IO ()
animate cs vs fs = mapM_ (\(c,v,f) -> writePng f $ toImage c v) $ zip3 cs vs fs
```

This is great. Let's call something  like:

```haskell
main = do
  let frames    = map (map toTile) $ reverse $ scanr twist solvedCube moves
  let views     = repeat isometric
  let filenames = map (\i -> "/tmp/frame" ++ show i ++  ".png") [100000..]
  animate frames views filenames
```

![2](/assets/images/irreversible-ii/simple.gif)

We can see the turns a bit more clearly if we explode the cube by tuning up `n`,
as noted above:

![3](/assets/images/irreversible-ii/simple-exploded.gif)

# Animating Motion

This is pretty good, but the whole point of a real isometric projection library
is the ability to draw tiles in places other than along x-y, x-z, or y-z planes.
Let's try tweening frames.

Tweening is a concept from animation wherein, given a start and end position and
a desired number of inbetween frames, we can generate those inbetween frames.
This is a little like interpolation, but there are lots of [different easing
curves](http://easings.net/) out there. For now we'll stick with linear motion,
though.

We want `tween` to take not a beginning- and end-state cube, but instead a
beginning-state cube and a `Side` to turn (and a number of frames across which
to turn it.

```haskell
tween :: Int -> Side -> Cube -> [[Obj]]
tween num side cube = map (`swivel` cube) angles
  where (cardinality, axis) = s2CA side
        angles = map (* toAngle cardinality) $ init 
               $ map (/ fromIntegral num) [0..(fromIntegral num)]
        swivel :: Float -> Cube -> [Obj]
        swivel ang = map (\t -> if side `sees` t
                                  then rotateFace ang axis $ toTile t
                                  else toTile t
                         )
```

`swivel` is just a local implementation of `twist` above, with an inline
renderer (toTile) which returns `[Obj]`s instead of `Cube`s. We generate a
sequence of angles by using `toAngle` from above, and then simply return a
series of cubes with more and  more of the desired twist angle applied to it. 

Now our `frames` looks like:

```haskell
let frames r = concatMap (uncurry $ tween r) 
             $ zip (reverse moves) (reverse $ scanr twist solvedCube moves)
```

where `r` the framerate, sort of - the number of frames across each turn should
occur.

If we write something like

```haskell
main = do
   let frames    = concatMap (uncurry $ tween 20)
                 $ zip (reverse moves) (reverse $ scanr twist solvedCube moves)
   let views     = repeat isometric
   let filenames = map (\i -> "/tmp/frame" ++ show i ++ ".png") [100000..]
   animate frames views filenames
```

We might get something like

![4](/assets/images/irreversible-ii/motion.gif)

# Roving Camera

Just for fun, let's create a series of `views` which, knowing the length of the
frameset, does a complete yaw rotation. (Also we're retuning `n=3` here for a
more exploded view.)

```haskell
mkViews :: Int -> [(Float,Float)]
mkViews n = zip ps ys
  where ys  = take n [0, (360 / fromIntegral n).. ]
        ps  = [35,35..]
```

```haskell
main = do
  ...
  let views = mkViews (length frames)
  animate frames views filenames
```

![5](/assets/images/irreversible-ii/motion-2.gif)

# Conclusion

These are all pretty fast to render, with the bulk of the difficulty being from
running `convert` after a run to stitch the produced `.png`s together into a
gif. Presumably `convert` holds the frames in-memory, which gets expensive for
longer animations; I found that using `Codec.Picture` to do the same thing
in-Haskell was equally or more expensive. 
