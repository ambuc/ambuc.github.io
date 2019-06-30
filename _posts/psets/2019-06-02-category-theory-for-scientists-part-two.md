---
title: Category Theory for Scientists, Ch. 2.4 - 2.5
layout: post
icon: project-diagram
categories: Psets
tags: mathematics category-theory ctfs-2013
---

This pset works through [_Category Theory for Scientists_][1], covering
[Chapters 2.4-2.5][2] and all exercises in sections 2.4-2.5. 

You can follow along with the [textbook][3] at home. 

All solutions are my own; feel free to [email me](james.adam.buckland@gmail.com)
with corrections.

[1]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/index.htm
[2]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_chapter2.pdf
[3]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/

# 2.4.1.4 

> How many elements does the set $\\{a,b,c,d\\} \times \\{1,2,3\\}$ have?

&zwj;
$\abs{A\times B} = \abs{A} \times \abs{B} = 4\times 3 = 12$.

<hr/>

# 2.4.1.8 

<!--
https://math.meta.stackexchange.com/questions/2324/how-to-draw-a-commutative-diagram
-->

> Let $\Z$ denote the set of integers, and let $+: \Z \times \Z \to \Z$ denote
> the addition function and $\cdot: \Z \times \Z \to \Z$ denote the
> multiplication function. Which of the following diagrams commute?
>
> **a)**  
>
> $$
\require{AMScd}
\begin{CD}
\Z\times\Z\times\Z @>{(a,b,c) \to (a\cdot b,a\cdot c)}>{g}> \Z\times\Z \\
@V{(a,b,c)\to(a+b,c)}V{f}V @V{i}V{(x,y)\to x+y}V \\
\Z\times\Z @>{h}>{(x,y)\to x\cdot y}> \Z
\end{CD}
$$

Doesn't commute.   

$$
\begin{align}
h\circ f &= x\cdot y = (a+b) \cdot c = (a\cdot c) + (b\cdot c) \\
i\circ g &= x + y = (a\cdot b) + (a\cdot c) \\
&\implies h \circ f \neq i \circ g
\end{align}
$$

> **b)**
> 
> $$
\require{AMScd}
\begin{CD}
\Z @>{x\to(x,0)}>{f}> \Z\times\Z \\
@. \diagdownarrow{\id_\Z} @V{g}V{(a,b)\to a\cdot b}V \\
@. \Z
\end{CD}
$$

Doesn't commute.

$$
\begin{align}
g\circ f &= a\cdot b = x \cdot 0 = 0 \\
\id_z &= x \\
&\implies g\circ f \neq \id_z
\end{align}
$$

> **c)**
> 
> $$
\require{AMScd}
\begin{CD}
\Z @>{x\to(x,1)}>{f}> \Z\times\Z \\
@. \diagdownarrow{\id_\Z} @V{g}V{(a,b)\to a\cdot b}V \\
@. \Z
\end{CD}
$$

Commutes.

$$
\begin{align}
g\circ f &= a\cdot b = x \cdot 1 = x \\
\id_z &= x \\
&\implies g\circ f = \id_z
\end{align}
$$

<hr/>

# 2.4.1.14 

> For every set $A$ there is some nice relationship between the following three
> sets: $\hbs(A, X)$, $\hbs(A, Y)$, and $\hbs(A, X\times Y)$.
> What is it?

$$
\begin{align}
\hbs(A, X\times Y) &= \{(f(a), g(a)) \mid f \in \hbs(A, X), g \in \hbs(A, Y), a \in A\} \\
&= \{ \langle f,g \rangle (a) \mid f \in \hbs(A, X), g \in \hbs(A, Y), a \in A\} \\
&= \{ \langle f,g \rangle (a) \mid (f, g) \in \hbs(A, X) \times \hbs(A, Y), a \in A\} \\
&= \hbs(A, X) \times \hbs(A, Y)
\end{align}
$$

<hr/>

# 2.4.1.15 

> Let $X$ and $Y$ be sets. Construct the "swap map" $s: X\times Y \to Y\times X$
> using only the universal property for products.
> 
> **a)** If $\pi_1: X\times Y\to X$ and $\pi_2: X\times Y \to Y$ are the
> projection functions, write $s$ in terms of the symbols "$\pi_1$", "$\pi_2$",
> "(", ")", and "$\circ$".

The universal property for products guarantees the unique existence of
$\langle f, g \rangle : A \to X \times Y$ given some set $A$ with morphisms
$f$, $g$ to $X$, $Y$ respectively. 

What if $A := Y\times X$?
The morphisms $f$, $g$, become $f := \pi_2: Y\times X \to X$, 
$g := \pi_1: Y\times X \to Y$.

This guarantees us the induced morphism 
$\langle f, g \rangle : A \to X \times Y $
$= \langle \pi_2, \pi_1 \rangle : Y\times X \to X \times Y$, which is the swap
map.

> **b)** Can you prove that $s$ is an isomorphism using only the universal
> property for products?

Given the swap map $s: X\times Y \to Y\times X$ and its opposite 
$s': Y\times X \to X\times Y$ as defined above, 
$s' \circ s = \id_{X\times Y}$, $s\circ s' = \id_{Y\times X}$.

This defines an isomorphism $X\times Y \cong Y\times X$.

<hr/>

# 2.4.2.10 

> Write the universal property for coproduct in terms of a relationship between
> the following three sets: $\hbs(X, A)$, $\hbs(Y, A)$, and
> $\hbs(X \sqcup Y, A)$.

$$
\begin{align}
\hbs(X\sqcup Y, A) &= \{ f(i) \mid i \in X\sqcup Y, f \in \hbs(X\sqcup Y, A)\} \\
&= \{ f(x) \mid x \in X, f \in \hbs(X,A)\} \\
&\qquad \sqcup \{g(y) \mid y \in Y, g \in \hbs(Y,Z)\} \\
&= \hbs(X,A) \sqcup \hbs(Y,A) 
\end{align}
$$

<hr/>

# 2.5.1.2 

> Let $X,Y,Z$ be as drawn and $f:X\to Z$, $g:Y\to Z$ the indicated functions.
>  * $f(x_1) = z_1, f(x_2) = z_2, f(x_3) = z_2$ 
>  * $g(y_1) = z_1, g(y_2) = z_2, g(y_3) = z_4, g(y_4) = z_2$.
> What is the pullback of 
> $X \xrightarrow{ f } Z \xleftarrow{ g } Y$ ?

A pullback of $X$ and $Y$ over $Z$ is any set $W$ for which $W \cong X
\times_Z Y$. Since $X \times_Z Y := \\{(x,w,y) \mid f(x) = w = g(y)\\}$, a
valid pullback would be $W := \\{(x_1,z_1,y_1), (x_2,z_2,y_2), (x_3,z_2,y_2),
(x_2,z_2,y_4), (x_3,z_2,y_4)\\}$.

<hr/>

# 2.5.1.5 

> **a)** Suppose that $Y = \emptyset$, what can you say about $X \times_Z Y$?

$Y = \emptyset \implies X\times_Z Y = \emptyset$ since there are no elements
in $Y$ such that $g(y) \in Z$.

> **b)** Suppose now that $Y$ is any set but that $Z$ has exactly one element,
> what can you say about $X\times_Z Y$?

If $Y$ is any set but $\abs{Z} = 1$, then every z-value in the fiber product will
be the same middle value $z$.

<hr/>

# 2.5.1.6 

> Let $S = \R^3$, $T = \R$, and think of them as (Aristotelian) space and time,
> with the origin in $S\times T$ given by the center of mass of MIT at the time
> of its founding. Let $Y=S\times T$ and let $g_1:Y\to S$ be one projection and
> $g_2:Y\to T$ the other projection. Let $X = {1}$ be a set with one element and
> let $f_1:X\to S$ and $f_2:X\to T$ be given by the origin in both cases.
> 
> What are the fiber products $W_1 = X \times_S Y$ and $W_2 = X \times_T Y$?

$W_1 := \\{(1,S_0,Y_0)\\}$, $W_2 := \\{(1,T_0,Y_0)\\}$, where $S_0$ is the
center of mass of MIT as it was at the time of its founding, $T_0$ is the time
of its founding, $Y_0$ is the center of mass of MIT and the time of its
founding, and $1$ is the singleton element in $X$.

<hr/>

# 2.5.1.13 

> Let $f:X\to Y$ be a function and $y \in Y$ an element. Draw a pullback diagram
> in which the fiber product is isomorphic to the preimage $f^{-1}(y)$.

The preimage of $y$ under $f$, denoted $f^{-1}(y)$, is the subset $f^{-1}(y)
:= \\{x \in X \mid f(x) = y \\}$. A set isomorphic to this preimage is
isomorphic to $X \times_Y \\{y\\}$, where $\\{y\\}$ is the set containing just
the element in question $y$. The set $\\{y\\}$ is mapped to $Y$ via the
inclusion function $\iota(y)$.

$$
\require{AMScd}
\begin{CD}
X\times_Y \{y\} @>{\pi_2}>> \{y\} \\
@V{\pi_1}VV @VV{\iota(y)}V \\
X @>{f}>> Y
\end{CD}
$$

<hr/>

# 2.5.3.4 

> Find a universal property enjoyed by the equlizer of two arrows, and present it in the style of the universal properties for [product](https://en.wikipedia.org/wiki/Product_(category_theory)#Definition), [coproduct](https://en.wikipedia.org/wiki/Coproduct#Definition), and [pullback](https://en.wikipedia.org/wiki/Pullback_(category_theory)#Universal_property).

Given any set $A$ and any morphism $m: A\to X$, there is an induced unique
morphism $u:A\to\text{Eq}(f,g)$ s.t., given equalizer morphism $p$, $p\circ u =
m$.

$$
\require{AMScd}
\begin{CD}
\text{Eq}(f,g) @>{p}>> X @>{f}>{g}> Y \\
@A{\exists!}A{u}A  \diaguparrow{\forall m} \\
A 
\end{CD}
$$

<hr/>

# 2.5.3.5 

> A terminal set is a set $S$ such that for every set $X$, there exists a unique
> function $X\to S$. Find a terminal set.

The set $\\{1\\}$ with one object is a terminal set. For any set $X$, there's
only one function which maps $X\to \\{1\\}$; the function which maps every
element in $X$ to $1$.
