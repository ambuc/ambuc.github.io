---
title: Puzzle Pong - Generating All Possible 4x4 Crosswords
layout: post

github: https://gist.github.com/ambuc/ac4ed787e1b9bb3eba08bb02c9b25c49
---

# The Problem
[Josh Mermelstein](http://joshmermelstein.com/) and I have decided to begin
challenging each other to a series of a math/programming puzzles. He asked me to
generate all possible valid English-language four-by-four crossword grids; that
is, a grid of sixteen letters where every row and column is a real English
word. One caveat was that no grid could have the same word twice.

An example grid:

    ACTS --> (across) acts, lore, idea, teem
    LORE     ( down ) alit, code, tree, seam
    IDEA
    TEEM

## The difficulty

It's easy to think of a two really bad ways to solve this problem:
 - You could try all $26^{16} = 4.36\times10^{22}$ grids and filter by
   validating their component words, or
 - you could find real four-letter english words (there are a little over 2000
   of them, so $ 2354 \text{ choose } 8 = 2.31\times10^{22}$ possible grids )
   and try and fit them, eight at a time, on a grid.

# The solution

The best way I found was to:
 - precompute a dictionary (called `paths` here) with 
   - keys like `"a"`, `"ab"`, `"abc"`, and
   - values corresponding to the lists of letters which, if put after their
     keys, would lead to real four-letter words.  
   - (For example, `paths["wok"] = ['e','s']`, or (perhaps less obviously),
     `paths["z"] = [('a','e','i','o']`.)
 - lay out all possible _starting grids_, where 
   - the top row and leftmost column were filled out
   - with two real four-letter words 
   - whose first letters were the same
 - for each grid (node, really),  
   - find the next blank, 
     - find the partial word above it, 
     - find the partial word to the left of it, 
     - look them both up in `paths`,  
     - take the intersection of the resultant lists
     - for each character in this intersection,
       - create a list of child nodes with the blank square filled in.

In this way, we guarantee that any placement will always lead to a real word in
that row and column.

## The code

I'll present the code annotated below, or in its [entirety in the attached
gist](https://gist.github.com/ambuc/ac4ed787e1b9bb3eba08bb02c9b25c49#file-crossword-hs).

{% highlight haskell %}
import qualified Control.Monad   as N (forM)
import qualified Data.Maybe      as B (isJust, isNothing, catMaybes)
import qualified Data.Char       as C (isAsciiLower)
import qualified Data.Function   as F (on)
import qualified Data.List       as L (all, nub, groupBy, intercalate)
import qualified Data.List.Split as L (chunksOf)
import qualified Data.Map.Strict as M (Map, insert, empty, unions, findWithDefault)
import qualified Language.Words  as W (allStringWords)

-- A box can either have a single character or nothing. Using the Maybe monad
-- here turned out to be a really useful decision, with functions like isJust
-- and catMaybes doing the heavy lifting for the most part.
type Box = Maybe Char

-- A grid is just a list of boxes. This was originally implemented as a
-- `Data.Matrix Maybe Char`, but it turned out to be very slow compared to a
-- stupid list. That said, I ended up having to rewrite the getters and setters,
-- as seen below.
type Grid = [Box]

-- One issue I ran into a lot was confusing row and col indices. Defining a
-- custom datatype akin to Either helped solve this -- it's a lot harder to pass
-- a Row index as a Column if the compiler catches it ;)
data Idx a = Row a | Col a deriving (Eq, Ord, Show)

-- This is the precomputed dictionary discussed above -- it maps Strings (like 
-- "a" or "abc") to list of chars (printed as `['a', 'e', 'i'...]`)
type Paths = M.Map String [Char]

-- This is the width of the grid. Can be changed, but it would be a hassle to
-- extricate into a command-line argument or even a main-block variable.
n = 4

-- Here begins the set of getters and setters I mentioned above. You can see
-- that while gridSet takes an element to insert, a tuple of the row and column
-- at which to insert it, the original grid, and returns the resultant grid. The
-- _type_ of `Row r` and/or `Col c` are `Idx Int`, since they are of type `Idx`, 
-- which is just a wrappeer for the `Int` index itself. By naming their types on
-- the left-hand side of the definition, we can use `r` and `c` in the
-- computation without unwrapping.
gridSet :: Num a => Char -> (Idx Int, Idx Int) -> Grid -> Grid
gridSet el (Row r, Col c) g = take i g ++ [Just el] ++ drop (i+1) g
  where i = (r-1)*n + (c-1)

-- Another trick with `Idx` -- we can pattern-match on the type, returning one
-- computation for the nth row of a grid, and another for the mth column.
-- This uses Data.List.chunksOf, which I', a big fan of.
gridGet :: Grid -> Idx Int -> [Box]
gridGet g (Col x) = map head $ L.chunksOf n $ drop (x-1) g
gridGet g (Row x) = take n $ drop (n*(x-1)) g

-- This is a pretty-printer for a grid -- it unwraps a list of [Maybe Char]s,
-- replacing Nothings with _; then it segments that into chunks of 4 and
-- recombines them with "\n".
gridPrint :: Grid -> String
gridPrint xs = L.intercalate "\n" $ L.chunksOf n $ unwrap xs
  where unwrap []            = ""
        unwrap (Just x : xs) =  x  : unwrap xs
        unwrap (Nothing: xs) = '_' : unwrap xs

-- This is a foldr implementing `gridSet` across a list of elements and a list
-- of (Row, Col) pairs. By zipping the chars and locs and `uncurry`ing them, we
-- avoid having to write something like  
-- gridWrite []     _      g = g
-- gridWrite (c:cs) (l:ls) g = gridSet c l $ gridWrite cs ls g
gridWrite :: String -> [(Idx Int, Idx Int)] -> Grid -> Grid
gridWrite cs ls g = foldr (uncurry gridSet) g $ zip cs ls

-- All the words we care about. There are 98k words in
-- Language.Words.allStringWords, probably taken from usr/share/dict/words. Of
-- those, 64 are lowercase ascii, and 2.3k are four lettersr long.
allWords :: [String]
allWords = filter (\x -> length x == n) 
         $ filter (L.all C.isAsciiLower) W.allStringWords

-- Here's where the magic happens. dictMake i creates a Paths, where:
-- type Paths = Map String [Char]
-- but only where the keys are of length `i`. We call it a few types and 
-- `M.unions` them together later on to commbine them into one Map in memory.
dictMake :: Int -> Paths
dictMake len = foldr (\xs -> M.insert (key xs) (val xs)) M.empty nglyphs
  where key     = take len . head
        val     = S.fromList . map (head . drop len)
        nglyphs = L.groupBy ((==) `F.on` take len) $ map (take $ len+1) allWords
-- Working backwards, assuming len = 2 for this example:
--                      allWords ~ ["abed", "abet", "able", "ably", "abut"...]
--   map (take $ len+1) allWords ~ ["abe", "abe", "abl",  "abl", "abu"...] 
-- L.groupBy ((==) `F.on` take len) $ map (take $ len+1) allWords 
--                               ~ [["abe", "abl"..], ["ace", "ace", "ach"]..]
-- from this list, we can map `key`, which gets just the first `len` letters
--                                   from the first item in each list, and
--                            `val`, which gets the list of remaining letters.
--                               ~ Map ["ab"] -> ['e','l'..]
--                                     ["ac"] -> ['e','h'..]
-- Then we fold this `(\xs -> M.insert (key xs) (val xs))` 
--              over `nglyphs`, with
--              base `M.empty`.


-- If the data being intersected is complex and needs to be sorted and nubbed,
--  treating the items as Sets is often efficient. That's why the following 
-- function, `children`, used to do a Set intersection, and `paths` used to 
-- contain values  of `S.Set Char`. 
-- 
-- But it turns out that the values in `Paths` comes pre-sorted and pre-nubbed
-- by virtue of its origins in `W.allStringWords`. So we don't want the overhead
-- of creating, comparing, and toList-ing `Data.Set`s. We don't even want the
-- overhead of `Data.List.intersection`, which sorts the arrays before taking
-- their intersection. For that reason, we implement `intersect` ourselves,
--  below.
intersect :: [Char] -> [Char] -> [Char]
intersect [] _ = []
intersect _ [] = []
intersect (a:as) (b:bs)
  | a == b = a : intersect as bs
  | a < b  = intersect as (b:bs)
  | a > b  = intersect (a:as) bs

-- `children` accepts a `paths` dictionary to hold inline, which end up being
-- fairly efficient -- I believe the compiler notices it is unchanged between
-- calls of `children` and makes it something like a global.
-- 
-- Anyway, `children` accepts a `paths` dictionary and a grid and returns the
-- possible child grids, as decribed above. This is just a list comprehension
-- where the location of the next blank is described by `(r,c)`, which zips the
-- grid with the locations of its squares and drops filled squares until we get
-- the location of the first blank.
--
-- Additionally, we find the `poss`ible next letters by taking the intersection
-- of the two `setValid` valid lists along the `c` column and `r` row indices,
-- where `setValid` utilized `Data.Maybe.catMaybes` to strip the `Nothing`s from
-- a list of `[Maybe Char]`s, and uses a macro'd `Data.Map.findWithDefault`
-- titled `nextIn`. to find it in the `paths` map.
children :: Paths -> Grid -> [Grid]
children p g = [ gridSet l (r,c) g | l <- poss g ]
  where (r,c) = snd $ head $ filter (B.isNothing . fst) $ zip g indices
        indices  = [ (Row i, Col j) | i<-[1..n], j<-[1..n] ]
        nextIn s = M.findWithDefault [] s p
        poss g   = intersect (setValid c) (setValid r)
          where setValid = nextIn . B.catMaybes . gridGet g

-- We want to start with grids with filled top rows and leftmost columns. We use
-- `gridWrite` from before to write full words along lists of locations,
-- described by `firstRow` and `firstColumn`. We write these into a `blank` grid
-- of sixteen `Nothing`s. This, too, is a list comprehension, which is
-- convenient for applying the restrictions which make our grids unique.
--
-- Specifically, we want the top and left words to be different, have the same 
-- first letter, and not appear again in the opposite configuration later on.
-- Luckily, we can compare `wa < wb` to make sure this holds.
seeds :: [Grid]
seeds = [ gridWrite wa firstRow $ gridWrite wb firstCol blank
        | wa <- allWords , wb <- allWords , wa < wb, wa /= wb, head wa == head wb
        ]
  where firstRow = [ (Row 1, Col x) | x <- [1..n] ]
        firstCol = [ (Row x, Col 1) | x <- [1..n] ]
        blank    = replicate (n^2) Nothing

-- As usual, we utilize the `until cond fn seed` pattern to apply `fn` to `seed` 
-- over and over ([x, f(x), f(f(x))..]) until one of the elements fulfills 
-- `cond`. In this case, we define `paths` right here, inline, as the union of
-- the `dictMake` dicts for a range of integers from 1 til one less the side
-- length.
--
-- Additionally, we `filter` our answer to make sure none of the grids have
-- repeating words. Eliminating these grids with duplicate words at the very end
-- is more efficient than whittling down the `paths` dictionary recursively. We
-- build `noRepeats` with `wordsIn`, which gets each row and column with
-- `gridGet`, builds a list, nubs it, and inspects its length.
grids = filter noRepeats 
      $ until (B.isJust . last . head) (concatMap $ children paths) seeds
  where paths       = M.unions $ map dictMake [1..(n-1)]
        noRepeats g = 2*n == length (wordsIn g)
        wordsIn g   = L.nub 
                    $ map (gridGet g)
                    $ concatMap (\x -> [Row x, Col x])
                    [1..n]

-- And that's it! Initially, we just want to print the number of grids, but 
-- we may do more interesting things with `grids` later.
main = print $ length $ grids
{% endhighlight %}

With comments, this is ~160 lines; without, this is ~70. 

## The answer
OK, what you came for. There are $686739$ distinct four-by-four crossword grids
in English with no repeats and no diagonal symmetry. The script runs in just
over a minute and uses far short of 100% of my memory (unlike several
intermediate versions).

# Runtime

Run normally, this script is fairly fast:

    j@mes $ ghc -O2 words.hs
    [1 of 1] Compiling Main             ( words.hs, words.o )
    Linking words ...
    j@mes $ time ./words
    686739

    real	1m1.138s
    user	1m0.810s
    sys	0m0.303s


But it was not always so. During development I made extensive use of the
built-in GHC profiler:

    j@mes $ ghc -prof -fprof-auto -rtsopts -O2 words.hs
    [1 of 1] Compiling Main             ( words.hs, words.o )
    Linking words ...
    j@mes ~/dev/math-problems/crossword $ time ./words +RTS -p
    686739

    real	2m8.759s
    user	2m8.277s
    sys	0m0.470s

This writes out to `words.prof` and looks something like: (see
[the full words.prof profiler output on Gist.](https://gist.github.com/ambuc/ac4ed787e1b9bb3eba08bb02c9b25c49#file-crossword-prof))

      Sun May 28 00:13 2017 Time and Allocation Profiling Report  (Final)

         words +RTS -p -RTS

      total time  =      107.52 secs   (107523 ticks @ 1000 us, 1 processor)
      total alloc = 134,700,416,432 bytes  (excludes profiling overheads)

    COST CENTRE            MODULE                     %time %alloc

    children.nextIn        Main                        20.8    0.0
    children.(...)         Main                        13.1   14.1
    gridGet                Main                        11.0   16.8
    children               Main                        10.0    6.1
    gridSet                Main                         9.4   20.8
    build                  Data.List.Split.Internals    7.7    9.9
    chunksOf               Data.List.Split.Internals    7.1   18.8
    grids                  Main                         5.7    2.6
    children.poss.setValid Main                         5.5    6.3
    intersect              Main                         5.3    1.8
    grids.wordsIn          Main                         1.9    1.2
    children.poss          Main                         1.4    1.4

Which gives a bit of a hint where things might be taking up a lot of time. In
this case, `nextIn` is taking up 20% of our time, and it's an $O(\log n)$
pre-optimized Map lookup function. Might be time to stop optimizing, with a
near-one-minute runtime.

# Fun

What else can we do with our program now that we have a pretty speedy crossword
solver? Well, because Haskell is lazy it's not that hard to see _if_ there
exists a 5x5 or 6x6 grid. By doing `main = putStrLn $ gridPrint $ head grids` we
end up executing incredibly fast:

## Sizes
 - In 0.062s it finds the following 4x4:

    ```
    ABED 
    BLUR 
    EERY 
    TWOS 
    ```

 - in 0.164s it finds the following 5x5:

    ```
    ABACI
    BOWED
    AXIAL
    SENSE
    EDGED
    ```

 - in 54s it finds the following 6x6:

    ```
    ABBESS
    SEESAW
    CATTLE
    ERRATA
    NEATER
    DRYERS
    ```

## Palindromes

Additionally, we can find "palindromic" crosswords, where the words are valid
even if the grid is rotated 90, 180, or 270 degrees:

 - in 6.627s it finds the following palindromic 4x4:

    ```
    0 deg ->  90deg -> 180deg -> 270deg
    DRAB      WARD      DRAW      BARD
    RAGA      AJAR      RAJA      AGAR
    AJAR      RAGA      AGAR      RAJA
    WARD      DRAB      BARD      DRAW
    ```

There are 10 such palindromic 4x4s; eight of them rely on the quartet
`raga/raja/ajar/agar` at their centers; the other two rely on
`time/tide/emit/edit`.

    ```
    DRAB DRAB DRAB DRAB DRAW DRAW TRAM TRAM
    RAGA RAJA RAGA RAJA RAGA RAJA RAGA RAJA
    AJAR AGAR AJAR AGAR AJAR AGAR AJAR AGAR
    WARD WARD YARD YARD YARD YARD PART PART

    STEP STEP
    TIDE TIME
    EMIT EDIT
    WETS WETS
    ```

## Word Frequency

By running

{% highlight haskell %}
main = Control.Monad.forM grids 
     $ \g -> appendFile "grids.txt" $ gridPrint g ++ "\n"                     
{% endhighlight %}

We can write a list of all grids to a file `grids.txt` and perform some
rudimentary Bash-level analysis on what sorts of words appear in the rows most
commonly:

    j@mes $ cat grids.txt | sort | uniq -c | sort -h | tail
      14642 west
      15424 oboe
      15516 oral
      16678 pest
      17451 test
      19541 psst
      22165 aria
      26541 oleo
      28531 area
      85689 urea

These don't quite look like the letter distributions we're used to in
full-fledged English -- let's look at letter frequencies and see how different
it is for four-letter words, and which letters are more likely to appear in
crosswords.

    j@mes $ awk -vFS="" '{for(i=1;i<=NF;i++)w[$i]++}END{for(i in w) print w[i],i}' grids.txt | sort -hr
      1673174 e
      1428194 a
      1307329 s
      781441 t
      722476 o
      709668 l
      693442 r
      450942 p
      448701 n
      424290 i
      324295 d
      296590 m
      246367 w
      236242 c
      221680 u
      204857 h
      199943 b
      185596 g
      114375 k
      106834 v
      104330 y
      80840 f
      17625 x
      4530 j
      4030 z
      33 q

Looks like `q` only appears 33 times; only ever in the context of `quay`,
`aqua`, `quip`, `quad`, `quit`, or `quid`.

# Conclusion

I have challenged [Josh Mermelstein](http://joshmermelstein.com/) to solve the
following puzzle:

> For a set of `n` letters `('a','b','d')` you can make `m` real English words
> `("bad", "dab", etc...)`. Find the subset of all 26 letters with the highest
> ratio of words to letters; in other words, the most bang for your buck.

