---
title: Writing a Solitaire TUI with Lenses and Brick
icon: style

layout: post
---

{% include project.html 
  github="https://github.com/ambuc/solitaire"
  %}

* TOC
{:toc}


    ┌───────────── Solitaire ──────────────┐                                       
    │┌──┐│┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│┌  ┐│ Score:   0                            
    ││λ=││┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐│7♠││    │                                       
    │└──┘│┌──┐┌──┐┌──┐┌──┐┌──┐│K♥│└──┘│└  ┘│ Moves:   0                            
    │┌──┐│┌──┐┌──┐┌──┐┌──┐│J♣│└──┘    │┌  ┐│                                       
    ││3♠││┌──┐┌──┐┌──┐│6♦│└──┘        │    │ [New]                                 
    │┌──┐│┌──┐┌──┐│9♣│└──┘            │└  ┘│                                       
    ││3♥││┌──┐│Q♠│└──┘                │┌  ┐│ [Undo]                                
    │┌──┐││4♠│└──┘                    │    │                                       
    ││7♦││└──┘                        │└  ┘│                                       
    │└──┘│                            │┌  ┐│                                       
    │    │                            │    │                                       
    │    │                            │└  ┘│                                       
    │    │                            │    │                                       
    └──────────────────────────────────────┘                                       

I'd wanted to write an implementation of
[Solitaire](https://en.wikipedia.org/wiki/Patience_(game)) a.k.a. Patience,
Klondike, etc in Haskell ever since I learned about
[brick](https://hackage.haskell.org/package/brick), a library for programming
terminal user interfaces (TUIs). I liked it because, as [the
docs](https://github.com/jtdaugherty/brick/blob/master/README.md) say, it

> ...exposes a declarative API. Unlike most GUI toolkits which require you to
> write a long and tedious sequence of "create a widget, now bind an event
> handler", `brick` just requires you to describe your interface using a set of
> declarative combinators. Then you provide a function to transform your
> application state when input or other kinds of events arrive.

The other component of this project involved learning about
[lenses](https://hackage.haskell.org/package/lens). Lenses are a [Template
Haskell](https://wiki.haskell.org/Template_Haskell) solution to [the record
problem](https://ghc.haskell.org/trac/ghc/wiki/Records), which concerns the
difficulty of reading from, writing to, and editing in-place deeply-nested
record variables. Although Haskell is an immutable language, sometimes in-place
modification is simply too convenient to abandon. Lenses are an elegant set of
combinators for working around this.

# Application Overview
This essay will be a high-level architecture of the game, but the code itself is
decently commented, and only spans [one
`Main.hs`](https://github.com/ambuc/solitaire/blob/master/app/Main.hs) and
[four](https://github.com/ambuc/solitaire/blob/master/src/CardTypes.hs)
[small](https://github.com/ambuc/solitaire/blob/master/src/Movement.hs)
[helper](https://github.com/ambuc/solitaire/blob/master/src/Render.hs)
[libaries](https://github.com/ambuc/solitaire/blob/master/src/Utils.hs).

## Brick
As discussed above, `brick` lets us define 
 * an `app :: App State Event ()` application state object, and
 * an `appEvent :: State -> Event e -> EventM () (Next State)` event handler
and that's almost entirely it. There's a bit more business for styling and
click region detection, but the core of the game takex place in the event loop
within `appEvent`.

```haskell
appEvent :: GSt -> BrickEvent Ext e -> EventM Ext (Next GSt)
appEvent s (VtyEvent e) = case e of
  Vty.EvKey Vty.KEsc        [] -> halt s
  Vty.EvKey (Vty.KChar 'q') [] -> halt s
  Vty.EvMouseDown col row _ _  -> do
    extents <- map extentName <$> findClickedExtents (col, row)
    case extents of
      [ActionX New]            -> continue $ newGame s
      [ActionX Undo]           -> continue $ undoMove s
      _                        -> if hasWon s
                                    then continue s
                                    else continue $ doMove s extents
  _                            -> continue s
appEvent s _                    = continue s
```
In the above, some keys `halt` the game, but most of them `continue` the game
either
 - with the state `s` as-is, or
 - with the state `s` modified by some function (`newGame`, `undoMove`, or
   `doMove`).

## Rules of Solitaire 
Before we continue let's just speak briefly about Solitaire.

    +-------+----------------------+
    | Stock |         |            |
    +-------+ Tableau | Foundation |
    | Waste |         |            |
    +-------+----------------------+

- Cards start either facedown in the `stock` or in seven piles of lengths 1, 2,..
in the `tableau`. 
- The stock is always facedown, but can be dealt three at a time to the
- The piles in the `tableau` are splayed downwards, and start with only their
top card visible. 
- Nothing starts in the `foundation`, but cards can accumulate there face-up.

Cards can be moved like so:

    +-------+----------------------+
    | Stock |         |            |
    |   ^   |        <--           |
    +-- | --+ Tableau | Foundation |
    |   v   |        -->           |
    | Waste ->        |            |
    +-------+----------------------+

Some more rules:
- in the `tableau` only a King can go on an empty pile, but any card can go on any
other card as long as it has a different color and is of exactly one rank less.
- in the `foundation` only an Ace can go on an empty pile, and any card can go on
a foundation pile as long as it matches the base suit and is of exactly one rank
more.

I'm not sure Solitaire is a very interesting game to play, but abstracting the
core ideas of cards, displaycards, piles, lists of piles, and operations between
them was a lot of fun.

# Custom Types

I think Haskell is fairly readable, so it might be best to just [look at the
`CardTypes.hs`
source](https://github.com/ambuc/solitaire/blob/master/src/CardTypes.hs). But
just as a quick overview, we define:
- a `Card` (rank and suit),
- a `DCard`, a display-card which wraps a `Card` and contains a preference for
being displayed face-up or face-down 
- a `Pile`, which is a list of `DCard`s with an opinion on what sort of card
can go at its base (for example, only a King, or only an Ace) as well as a
preference for its cards being displayed stacked or splayed out.
- a `GSt`, a game state which wraps the stock, waste, tableau, and foundation,
as well as containing the current score, the elapsed move count, a random seed,
and a history of prior fields and scores.

## `Show` instances
We can make our own type instance of a few of the above custom typeclasses by defining what it means to `Show` a `Rank` or `Suit`.
```haskell
instance Show Rank where
  show RA  = "A";
  show R2  = "2"; show R3  = "3"; show R4  = "4"; show R5  = "5";
  show R6  = "6"; show R7  = "7"; show R8  = "8"; show R9  = "9";
  show R10 = [toEnum 0x2491] :: String; -- unicode ligature for one-char width 
  show RJ  = "J"; show RQ  = "Q"; show RK  = "K";

instance Show Suit where
  show Spade   = [toEnum 0x2660] :: String -- unicode characters for suits
  show Heart   = [toEnum 0x2665] :: String
  show Diamond = [toEnum 0x2666] :: String 
  show Club    = [toEnum 0x2663] :: String
```

## Lenses 101
We want to define our record fields with underscores like so:

```haskell
data DCard = DCard { _card    :: Card
                   , _facedir :: FaceDir }     
  deriving (Eq, Show, Ord)
```

So that the `Lens` library can,  at compile time, create functions like `card`
or `facedir` which can be called on `DCard` objects, like so:

```haskell
> let dc = DCard { _card    = Card RA Club
                 , _facedir = FaceDown
                 }
> dc
DCard { _card = Card A ♣, _facedir = FaceDown }
> dc ^. card
Card A ♣
> dc & facedir .~ FaceUp
DCard { _card = Card A ♣, _facedir = FaceUp }
```

where `(^.)` is a getter and `.~` is a setter (sorta). For more read the [lens
tutorial](https://hackage.haskell.org/package/lens-tutorial-1.0.3/docs/Control-Lens-Tutorial.html).

By the same convention, a deeply-nested object could be accessed with
```haskell
obj & fieldOuter . fieldInner . fieldVeryInner %~ mutationFn
```

which makes it super easy for us to just pass around the `Field` or the `GSt`
gamestate and modify it at any level. Thanks, Lenses!

# Output

Just as we wrote a set of abstract data types above which can be composed into
flexible `Pile`s, etc., we want to write a set of abstract render functions which
can be composed to draw a `Pile`, or a `DCard`, or whatever. Brick wants us to define our `app` like so:

```haskell
app = App { appDraw = drawUI
          , ...
          }
```

where `drawUI :: GSt -> [Widget ()]` handles every part of the program, from
the field to the score counters. It is a pure function of the game state and
doesn't need callbacks or promises or event handlers at all, _except_ that we
can name certain regions so that, when clicked, Brick handles a `BrickEvent Ext
(Vty.EvMouseDown col row _ _)` where `extents = map extentName $
findClickedExtents (col,row)` lets us interpet the observed column and row and
get a list of clicked extents. We can report a named extent by wrapping it in `reporteExtent ExtentName`.

Brick provides some primitive combinators for stacking widgets (rectangles) next to (`<+>`) or above (`<=>`) each other, as well as some primitive widgets for displaying text (`str :: String -> Widget ()`), wrapping widgets in styled borders, ( `withBorderStyle unicodeRounded $ borderWithLabel (str "title") $ myWidget`), etc. As before, the code is [fairly readable](https://github.com/ambuc/solitaire/blob/master/src/Render.hs), so I'll just cover some interesting mechanics here briefly before moving on.

## Custom Borderstyles
A typical card looks like this: a string `7♦` wrapped in a `unicodeRounded` border:

    ┌──┐
    │7♦│
    └──┘

but we want to be able to draw custom border too, in the case of our empty piles:

    ┌  ┐

    └  ┘

Brick lets us define custom borderstyles like so:

```haskell
rrGhost :: Widget Ext -- renders a 'ghost' card with no content
rrGhost = withBorderStyle ghostRounded $ border $ str "  "
  where ghostRounded = BorderStyle 
          { bsIntersectFull = toEnum 0x253C
          , bsCornerTL      = toEnum 0x256D , bsCornerTR      = toEnum 0x256E
          , bsCornerBR      = toEnum 0x256F , bsCornerBL      = toEnum 0x2570
          , bsIntersectL    = toEnum 0x251C , bsIntersectR    = toEnum 0x2524
          , bsIntersectT    = toEnum 0x252C , bsIntersectB    = toEnum 0x2534
          , bsHorizontal    = ' '           , bsVertical      = ' '
          }
```

Where those unicode `0x....` codes are just various box-drawing characters, and
the `bsVertical` and `bsHorizontal` codes are (intentionally) spaces.

## Piles
Once we have a `drawCard` function, we can stack the cards by cropping their bottom or right borders as necessary, with more of the card cropped if it is meant to be face-down than if it is meant to be face-up. For example,

    stacked face-up  |  stacked face-down
    ┌──┐             │┌──┐
    │3♥│             │┌──┐
    ┌──┐             ││4♠│
    │7♦│             │└──┘
    └──┘             │

Otherwise, `Render.hs` is mostly composing existing Brick primitives in easy
ways. 

# Input

OK, here's where the complexity of the game begins to shine through.

In computer solitaire, we typically expect to be able to click on a card and it
will, it possible, move to the next open position. Thus, whenever a card gets clicked on, we should be able to figure out the next valid pile it could be moved to and move it there.

We can do so with lenses -- and we can define our own lenses with independent getters and setters to make doing so easier.

For example, here's a `lens` which writes to or reads from the stock. Its type is `stockL :: Lens' Field [DCard]`, and it either reads and returns a list of `DCard`s or accepts a list of `DCard`s and writes them to the stock. The syntax is

```haskell
fooLens = Lens (anonymous getter) (anonymous setter)
```
              
```haskell
-- creates a lens from the field to the stock
-- operates on lists of displaycards
stockL :: Lens' Field [DCard] --all
stockL = lens (\f -> f ^. stock.cards)
              (\f dcs -> f & stock.cards .~ dcs)
```

Actually, let's use this opportunity to flip the cards at read/write-time. We can use `each` to iterate over each of the returned or processed objects and apply some transformation with `(.~)`.

```haskell
stockL = lens (\f -> f ^. stock.cards & each.facedir .~ FaceUp)               
              (\f dcs -> f & stock.cards .~ (dcs & each.facedir .~ FaceDown)) 
```

Perfect. In
[`Movement.hs`](https://github.com/ambuc/solitaire/blob/master/src/Movement.hs)
you can see custom lenses for the stock, the waste, as well as two lens
generators for the tableau and foundation which instead _a)_ return Piles
instead of `[DCard]`s, and _b)_ accept an integer index for which tableau pile
/ foundation pile to return. They are of type `tableLN :: Int -> Lens' Field
Pile`, where `N` is a convention for indexed generators.

## `doMove`
Eventually we want to be able to, upon reading a list of `extents` from a
clicked region, continue with our game by calling

```haskell
appEvent :: GSt -> BrickEvent Ext e -> EventM Ext (Next GSt)
appEvent s (VtyEvent e) = case e of
  Vty.EvMouseDown col row _ _  -> do
    extents <- map extentName <$> findClickedExtents (col, row)
    case extents of 
      _                        -> if hasWon s
                                    then continue s 
                                    else continue $ doMove s extents
```

We'll write `hasWon :: GSt -> Bool` later, but for now let's write `doMove :: GSt -> [Ext] -> GSt`, which tries to move the clicked card and, if successful, returns a changed `GSt` with incremented `moves` ticker, mutated `score`, and augmented `history`.

```haskell
doMove :: GSt -> [Ext] -> GSt
doMove s exs = if wasChange
                 then s & field .~ newField
                        & history %~ ((oldField, oldScore):)
                        & score %~ scoreFn
                        & moves %~ succ
                 else s
  where
    wasChange = oldField /= newField
    oldField = s ^. field
    oldScore = s ^. score
    (newField, scoreFn) = tryMove exs oldField
```

Here we can see chained 

```haskell
foo & fieldA .~ newFieldA 
    & fieldB .~ newFieldb
```

operator chaining for the first time, which is pretty snazzy. Here, `doMove`
expects a `tryMove` function which will return not just the new field, but a
score mutator (+5, -10, `id`, etc.).

## Extents

```haskell
data Ext = StockX | WasteX | TableX | FoundX
         | IdX Int | DCX DCard | ActionX Action
  deriving (Eq, Show, Ord)
```

Before we write `tryMove`, we should talk about Extents and what they look like
in practice. They end up being lists of clicked extents where the innermost
extents are first. We can wrap our stock, waste, etc. in `StockX`, `WasteX`,
etc. extent labels, and we can report the `DCard` directly with a `DCX`
wrapper. Later we'll use the `ActionX` wrapper to report something of type
`Action`.

Finally, we can use `IdX Int` as a wrapper for a row/col index.

For now let's write `tryMove` by pattern-matching on the reported extents. Each region will have a different shape so we should be able to striate our regions fairly easily.

 - `[StockX]`: reporting just an empty `StockX` region means there are no
cards, so we should refresh it from the waste.

 - `[_, StockX]`: reporting a non-empty stock means we want to take three cards
from the stock and move them to the waste.

 - `[DCX dc, IdX 0, WasteX]`: reporting from the top of the waste stack means
we should try to move it. We don't pattern-match on just any index in the waste
since none of the others are actionable.

 - `[DCX dc, Idx row, FoundX]`: reporting from any row in the foundation means
we should try and move its topmost card.

 - `[DCX dc, Idx row, Id col, TableX]`: reporting from the tableau means we
expect a row and column index, which tells us where in the tableau structure to
try and read from. Uniquely, we can read a card or a stack of cards at a time
from the tableau and move them all as a unit, as long as the stack of cards
doesn't leave the tableau.

One more thing to do before we can write `tryMove`:

## Movement Lenses

Eventually, we want to be able to write (pseudocode below):

```haskell
process state =
  if (canMove?)
    then state & newLocation %~ (card:)  -- add one or more cards
               & oldLocation %~ (drop n) -- drop n cards
    else state
```

these `newLocation` and `oldLocation` lenses will have to be deduced from
context.

Let's get a list of our tableau and foundation lenses:

```haskell
inTableau :: Functor f0 => [(Pile -> f0 Pile) -> Field -> f0 Field]
inTableau = map tableLN [0..6] 

inFoundation :: Functor f0 => [(Pile -> f0 Pile) -> Field -> f0 Field]
inFoundation = map foundLN [0..3] 
```

These are _almost_ of type `Lens' Field Pile`, but not quite. We define them
differently here because they aren't setters or getters yet. If we defined them
as `Lens'` types, they'd be polymorphic, and the process of evaluating them
thru a `filter cond ls` mechanism would solidify them as setters, when ideally
we want to be able to later turn around and use them as getters.

Each location can provide its own set of candidate lenses (usually either
`inFoundation++inTableau` or `inTableau`, but it will depend) and evaluate them
through `findSpot`, which takes a list of lenses and a card and a field and
returns the index of the first matching lens, if possible.

```haskell
findSpot :: [Getting Pile s Pile] -> Card -> s -> Maybe Int
findSpot pLenses c f = findIndex (\pL -> canPlace c (f ^. pL)) pLenses
```

`canPlace` is a manual bit of pattern-matching which lives in [`Utils.hs](https://github.com/ambuc/solitaire/blob/master/src/Utils.hs#L35-L65) and runs through the types of piles and types of cards to provide a true/false.

In practice it is convenient to provide two helpers to `findSpot`:

```haskell
isSpot pLs c f = isJust $ findSpot pLs c f
mkSpot pLs c f = fromJust $ findSpot pLs c f
```

We can use the first in `canMove`, and the second in `mkMove`. `canMove` tells
us whether there is a spot for a card to go elsewhere in the field, and
`mkMoveL` will, assuming there is a spot, return both a lens to that spot and
the piletype of the spot the card can go to.

```haskell
canMove :: Int -> DCard -> Field -> Bool
canMove _ DCard{_facedir=FaceDown} _ = False
canMove 0 DCard{_card=c}           f = isSpot (inFoundation ++ inTableau) c f 
canMove _ DCard{_card=c}           f = isSpot inTableau c f 

mkMoveL :: Functor f => Int -> Card -> Field 
                     -> ( (Pile -> f Pile) -> Field -> f Field, PileType)
mkMoveL 0 c f = if idx <= 3 
                  then (foundLN idx       , FoundP)
                  else (tableLN (idx - 4) , TableP)
  where idx = mkSpot (inFoundation ++ inTableau) c f 
mkMoveL _ c f = (tableLN $ mkSpot inTableau c f , TableP)
```

OK, let's write `tryMove`. If you don't like lenses, the above was the worst of
it.

## `tryMove`

We expect `tryMove` to have the form:

```haskell
tryMove :: [Ext] -> Field -> (Field, Int->Int)
```

### `tryMove [StockX]` Moving from the Stock (i)

Let's write the `tryMove [StockX]` function first, since it is the simplest:

```haskell
tryMove [StockX] f = (f',id)
  where f' = f & stockL %~ (reverse load ++)
               & wasteL .~ []
        load = f ^. wasteL
```

Even for Haskell, this is pretty esoteric. we read a load from the waste using
the `wasteL` custom lens, reverse it, and prepend it (++) to the stock by using
the in-place mutation operator (`%~`), while overwriting the waste with an
empty list (`.~`). We return that new field `f'` and a `scoreFn` `id`, which
keeps the score as-is.

### `tryMove [_, StockX]` Moving from the Stock (ii)

This is pretty similar to the last function, except that we are reading from
the stock and writing to the waste instead. We drop 3 and take 3 at a time.
Remember that the need to flip our cards over is handled innately in the
`stockL` and `wasteL` lenses!

```haskell
tryMove [_, StockX] f = (f',id)
  where f' = f & stockL %~ drop 3            --drop 3 from stock
               & wasteL %~ (reverse load ++) --add 3 to waste
        load = f ^. stockL & take 3          --get 3 from stock
```

### `tryMove [DCX dc, IdX 0, WasteX]` Moving from the Waste

We've already solved the hardest subproblem, that if determining whether or not
a card can move anywhere else in the field. So we can just use `canMove
rowIndex displaycard field` to decide whether or not to try to evaluate
`f'`. If we do, it lazily evaluates `mkMoveL`, which returns the `moveL` lens
which we can use to write one card to the location in question. We also use the
computed `PileType` to inform our scoring mutator.

```haskell
tryMove [DCX dc, IdX 0, WasteX] f
  | canMove 0 dc f = (f', scoreFn)
  | otherwise      = (f , id)
  where (moveL, pType) = mkMoveL 0 (dc ^. card) f
        f'             = f & moveL . cards %~ (dc:) --write 1 to _
                           & wasteL %~ drop 1       --drop 1 from waste
        scoreFn
          | pType == FoundP = (+10)
          | otherwise       = (+5)
```

### `tryMove [DCX dc, IdX row, FoundX]` Moving from the Foundation

```haskell
tryMove [DCX dc, IdX row, FoundX] f
  | canMove row dc f = (f', scoreFn)
  | otherwise        = (f , id)
  where (moveL, pType) = mkMoveL row (dc ^.  card) f
        f'             = f & moveL . cards %~ (dc:)        --write 1 to _
                           & foundLN row . cards %~ drop 1 --drop 1 from found.
        scoreFn i = i - 15 
```

This is starting to feel familiar; we know how to move one card at a time. The
only difficulty comes when it's time to move from the tableau; we could be
moving one card or more at a time.


### `tryMove [DCX dc, IdX row, Idx col, TableX]` Moving from the Tableau

```haskell
tryMove [DCX dc, IdX row, IdX col, TableX] f
  | canMove row dc f = (f', scoreFn)
  | otherwise        = (f , id)
  where load = f ^. tableLN col . cards & take (succ row) 
        (moveL, pType) = mkMoveL row (dc ^. card) f
        f'             = f & moveL . cards %~ (load++)   --write n to _
                           & tableLN col . cards 
                              %~ drop (succ row)         --drop n from tableau
                           & tableLN col . cards . _head . facedir
                              .~ FaceUp                  --flip underlying card
        scoreFn
          | pType == FoundP = (+15)
          | otherwise       = (+5)
```

OK, this was definitely the most difficult one, But we've built ourselves a nice set of primitives, so that flipping the underlying card, or dropping `n` cards from the tableau row in question become pretty readable.

This is great! A well-formed `tryMove` mean we can write `doMove`, and the core
of our game is finished.

# Final Touches

Now that we know how to use lenses, a lot of the remaining functions are pretty simple:

```haskell
-- if a game is won, all 52 cards are in the foundation
hasWon :: GSt -> Bool
hasWon s = length (s ^. field . found . traverse . cards) == 52
```

```haskell
-- undoing a move means rolling back the field, the history, the score, and
-- the moves counter 
undoMove :: GSt -> GSt
undoMove s = if hasHistory
               then s & field .~ oldField
                      & history %~ drop 1
                      & score .~ oldScore
                      & moves %~ pred

               else s
  where (oldField, oldScore) = s ^. history ^?! _head -- assured if called
        hasHistory = not $ null $ s ^. history
```

```haskell
-- given a game with a seed, get a new seed and use it to spawn a new game
newGame :: GSt -> GSt  
newGame s = let seed' = snd $ R.next $ s ^. seed 
            in  mkInitS seed'
```

Now we can finally finish `appEvent` and our app is done!

```haskell
appEvent :: GSt -> BrickEvent Ext e -> EventM Ext (Next GSt)
appEvent s (VtyEvent e) = case e of
  Vty.EvKey Vty.KEsc        [] -> halt s
  Vty.EvKey (Vty.KChar 'q') [] -> halt s
  Vty.EvMouseDown col row _ _  -> do
    extents <- map extentName <$> findClickedExtents (col, row)
    case extents of 
      [ActionX New]            -> continue $ newGame s
      [ActionX Undo]           -> continue $ undoMove s
      _                        -> if hasWon s
                                    then continue s 
                                    else continue $ doMove s extents
  _                            -> continue s 
appEvent s _                    = continue s
```

# Conclusions

I think a good UI framework is one where the bulk of the difficulty of writing
the app is the internal logic of the underlying app itself, not fighting with
the framework. Brick fit right into my functional understanding of frameworks
like React or Angular, and although there was some learning curve for lenses,
the final product is, like all Haskell, surprisingly short and readable.

If you've never played with Haskell before, I think Brick is an excellent place
to start. I encourage you to [download and play
Solitiare](https://github.com/ambuc/solitaire#playing-solitaire) if you're
interested in getting a feel for the ecosystem, or just [reading through some
of the code](https://github.com/ambuc/solitaire/blob/master/src/CardTypes.hs)
if you're interested in how a comparatively large app feels at a low level.

