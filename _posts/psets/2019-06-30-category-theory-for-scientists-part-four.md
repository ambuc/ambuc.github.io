---
title: Category Theory for Scientists, Ch. 2.7
layout: post
icon: project-diagram
categories: Psets
tags: mathematics category-theory ctfs-2013
---

This pset works through [_Category Theory for Scientists_][1], covering
[Chapters 2.7][2] and all exercises in section 2.7. 

You can follow along with the [textbook][3] at home. 

All solutions are my own; feel free to [email me](james.adam.buckland@gmail.com)
with corrections.

[1]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/index.htm
[2]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_chapter2.pdf
[3]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/

# 2.7.2.2 

> For a finite set $A$, let $\abs{A} \in \N$ denote the cardinality of (number
> of elements in) $A$. If $A$ and $B$ are both finite (including the possibility
> that one or both are empty), is it always true that $\abs{B^A} =
> \abs{B}^\abs{A}$?

Recall that a function is a set of ordered pairs $\\{(a,b) | a\in A, b\in B\\}$,
where that set can be empty.

If $A$ and $B$ are non-empty, $\abs{B^A} = \abs{B}^\abs{A}$. 

If $A = \emptyset$:
 - $\abs{B}^\abs{A} = \abs{B}^0 = 1$.
 - $B^\emptyset = \hbs(\emptyset,B) = \\{\\{\\}\\}$, i.e. the set of functions
   has one element, an empty set of mappings $\emptyset\to B$. So
   $\abs{B^\emptyset} = 1$.

If $B = \emptyset$:
 - $\abs{B}^\abs{A} = 0^\abs{A} = 0$.
 - $\emptyset^A = \hbs(A, \emptyset) = \\{\\}$, i.e. the set of functions has
   no elements. So $\abs{\emptyset^A} = 0$.


So it is always true that $\abs{B^A} = \abs{B}^\abs{A}$.

<hr/>

# 2.7.2.4 

> Let $X = \\{1,2\\}$, $A = \\{a,b\\}$, and $Y = \\{x,y\\}$.
> **a)** Write down three distinct elements of $L := \hbs(X\times A, Y)$.

$L$ is the set of functions from $X\times A \to Y$. Here are three functions in
$L$:

 - $\ell_1(2,b) = y, \quad \ell_1(-,-) = x$.
 - $\ell_2(1,a) = \ell_2(2,b) = x, \quad \ell_2(-,-) = y$.
 - $\ell_3(1,a) = x, \quad \ell_3(-,-) = y$.

    X\A  a b      X\A  a b      X\A  a b
      1  x x        1  x y        1  x y
      2  x y        2  y x        2  y y

> **b)** Write down all the elements of $M := \hbs(A,Y)$.

$M$ is the set of functions from $A\to Y$. Here are all the possible functions
in $M$:
 - $f_1(a) = f_1(b) = x$
 - $f_2(a) = f_2(b) = y$
 - $f_3(a) = x, \quad f_3(b) = y$.
 - $f_4(a) = y, \quad f_4(b) = x$.

> **c)** For each of the three elements of $\ell \in L$ you chose in part a),
> write down the corresponding function $\phi(\ell): X\to M$ guaranteed by
> Proposition 2.7.2.3.

 - $\phi(\ell_1)(1) = f_1, \quad \phi(\ell_1)(2) = f_3$.
 - $\phi(\ell_2)(1) = f_3, \quad \phi(\ell_2)(2) = f_4$.
 - $\phi(\ell_3)(1) = f_3, \quad \phi(\ell_3)(2) = f_2$.

<hr/>

# 2.7.2.5 

> Let $A$ and $B$ be sets. We know that $\hbs(A,B) = B^A$, so we have a function
> $\id_{B^A} : \hbs(A,B) \to B^A$. Look at Proposition 2.7.2.3, making the
> substitutions $X = \hbs(A,B)$, $Y = B$, and $A=A$. Consider the function
> 
> $$ \phi^{-1}: \hbs(\hbs(A,B),B^A) \to \hbs(\hbs(A,B)\times A, B) $$
> 
> obtained as the inverse of 2.42. We have a canonical element $\id_{B^A}$ in the
> domain of $\phi^{-1}$. We can apply the function $\phi^{-1}$ and obtain an
> element $ev = \phi^{-1}(\id_{B^A}) \in \hbs(\hbs(A,B)\times A, B)$, which is
> itself a function:
> 
> $$ ev: \hbs(A,B)\times A \to B $$
> 
> Describe the function $ev$ in terms of how it operates on elements in its
> domain.  

This is the evaluation function. It takes as domain an element $f$ from the set
of functions $A\to B$ and an element $a\in A$, evaluates $f(a) = b$, where $b\in
B$. 

<hr/>

# 2.7.2.6 

> In Example 2.4.1.7 we said that $\R^2$ is an abbreviation for $\R\times\R$,
> but in 2.43 we say that $\R^2$ is an abbreviation for $\R^\underline{2}$. Use
> Exercise 2.1.2.14, Proposition 2.7.2.3, Exercise 2.4.2.10, and the fact that
> $1+1=2$ to prove that these are isomorphic, $\R^\underline{2} \cong
> \R\times\R$.

We can start with the definition of $\R^\underline{2}$: 

$$ \R^\underline{2} = \hbs(\underline{2}, \R) = \hbs(\{1,2\},\R) $$

Since we know we can define the set $\\{1,2\\} = \\{1\\} \sqcup \\{2\\}$, 
and since we
know $\hbs(X\sqcup Y, A) \cong \hbs(X,A) \times \hbs(Y, A)$ (2.4.2.10), we
can write:

$$ \R^\underline{2} \cong \hbs(\{1\}, \R) \times \hbs(\{2\}, \R)$$

Since $\\{1\\}\cong\\{2\\}$, and since $\hbs(\\{1\\},X) \cong X$ (2.1.2.14), 
we can write:

$$\R^\underline{2} \cong \R \times \R = \R^2$$

<hr/>

# 2.7.3.2 

> Everything in Proposition 2.7.3.1 is true except in one case, namely that of
> $$\underline{0}^\underline{0}$$.
> 
> In this case, we get conflicting answers, because for any set $A$, including
> $A = \emptyset = \underline{0}$, we have claimed both that $A^\underline{0}
> \cong \underline{1}$ and that $\underline{0}^A \cong \underline{0}$.
> 
> What is the correct answer for $\underline{0}^\underline{0}$, based on the
> definitions of $\underline{0}$ and $\underline{1}$ given in 2.6, and that of
> $A^B$, given in 2.41?

The set of morphisms from $\underline{n}\to\emptyset$ is empty, since any such
morphism would need to map all the elements of $\underline{n}$ to some
element in $\emptyset$, which clearly holds no elements. So
$\abs{\hbs(\underline{n}, \emptyset)} = 0$, which means $0^\underline{n} = 0$.

By comparison, the set of morphisms from $\emptyset\to\emptyset$ need not be
empty. Any such morphism would have no domain and no codomain, and map no
elements. But there is one such morphism, an isomorphism between $\emptyset$ and
itself. So $\abs{\hbs(\emptyset, \emptyset)} = 1$, which means $0^0 = 1$.

<hr/>

# 2.7.3.3 

> It is also true of natural numbers that if $a,b\in\N$ and $ab=0$ then either
> $a=0$ or $b=0$. Is the analogous statement true of all sets?

Given $\abs{A\times B} = \abs{A} \cdot \abs{B}$, if $A \times B = \emptyset$,
then $\abs{A \times B} = 0$. Thus it must be the case that either $\abs{A} = 0$
or $\abs{B} = 0$. Thus either $A = \emptyset$ or $B = \emptyset$. (There are no
sets with cardinality zero besides the empty set.) So the analogous statement
_is_ true of all sets.

<hr/>

# 2.7.3.4 

> Explain why there is a canonical function $\underline{5}^\underline{3} \times
> \underline{3} \to \underline{5}$ but not a canonical function
> $\underline{375}\to\underline{5}$.

$\underline{5}^\underline{3} \times \underline{3} \to \underline{5}$ can be seen
as an evaluation:

 - $\underline{5}^\underline{3}$ is the set of all points in a
   $5\times5\times5$ grid. So $p \in \underline{5}^\underline{3}$ is a
   point in that grid.

 - $\underline{3} := \\{1,2,3\\}$. So $a \in \underline{3}$ is an axis in the
   set of all three axes.

So we can understand $\underline{5}^\underline{3} \times \underline{3}$ as an
evaluation function; given a single point in $\underline{5}^\underline{3}$ and a
single axis in $\underline{3}$, we can project the point on to that axis and
return a single element in $\underline{5}$ (a.k.a. how far along the axis that
point is).

So there is an obvious, canonical mapping between $\underline{5}^\underline{3}
\times \underline{3}$ and $\underline{5}$. 

But if that domain is flattened into a set of 375 points, that canonical mapping
is lost: an element in that domain no longer represents a point in a
three-dimensional grid paired with an axis in that grid; it merely represents
some point and some axis. So it is not obvious how to project that point, so
there is no canonical function $\underline{375} \to \underline{5}$.

<hr/>

# 2.7.4.2 

> **a)** How many elements does $\P(\emptyset)$ have?

$\abs{\P(\emptyset)} = 1$. There is one subset of the empty set, itself.

> **b)** How many elements does $\P(\\{1\\})$ have?

$\abs{\P(\\{1\\})} = 2$. There are two subsets of $\\{1\\}$: itself and
$\emptyset$.
 
> **c)** How many elements does $\P(\\{1,2,3,4,5,6\\})$ have?

$\abs{\P(\\{1,2,3,4,5,6\\})} = 32$. I won't enumerate them, but for any subset
$S' \subseteq S$, an element $s \in S$ either _is_ or _is not_ included in $S'$.
With two choices per element, there are $2^6$ possible subsets in a set with 6
elements.
 
> **d)** Any idea why they may have named it "power set"?

Because $\abs{\P(\underline{n})} = 2^n$; two to the nth power.

<hr/>

# 2.7.4.6 

> Let $X$ be the following simplical complex, such that $X_0 = \\{A,B,...,M\\}$.
> In this case $X_1$ consists of elements like $\\{A,B\\}$ and $\\{D,K\\}$ but
> not $\\{D,J\\}$.
> 
> Write out $X_2$ and $X_3$ (hint: the drawing of $X$ indicates that $X_3$
> should have one element).

(This only makes sense with the diagram, which you might find in the [textbook](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_chapter2.pdf).)

The set of 1-simplexes $X_1$ is the set of edges:

$$
\begin{align}
X_1 &= \{ \{A,B\}, \{A,C\},             &&\qquad  \{B,C\}, \{B,D\}, \\
    &\qquad  \{C,F\}, \{C,I\}, \{C,J\}, &&\qquad  \{D,K\}, \\
    &\qquad  \{E,F\}, \{E,G\},          &&\qquad  \{F,G\}, \{F,H\}, \\
    &\qquad  \{G,H\}, \{G,I\}, \{G,L\}, &&\qquad  \{H,I\}, \\
    &\qquad  \{I,J\}, \{I,K\},          &&\qquad  \{J,K\}, \\
    &\qquad  \{K,L\}, \{K,M\},          &&\qquad  \{L,M\}\}
\end{align}
$$

The set of 2-simplexes $X_2$ is the set of faces:

$$
\begin{align}
X_2 &= \{ \{A,B,C\},    && \qquad \{C,I,J\}, \\
    & \qquad \{E,F,G\}, && \qquad \{F,G,H\}, \{F,H,I\}, \\
    & \qquad \{G,H,I\}, && \qquad \{I,J,K\}, \\
    & \qquad \{K,L,M\}\}
\end{align}
$$

The set of 3-simplexes $X_3$ is the set of volumes.

$$
\begin{align}
X_3 &= \{\{F,G,H,I\}\}
\end{align}
$$

<hr/>

# 2.7.4.7 

> The 2-simplex $\Delta^2$ is drawn as a filled-in triangle with vertices $V =
> \\{1,2,3\\}$. There is a simplical complex $X = \partial\Delta^2$ that would
> be drawn as an empty triangle with the same set of vertices.
> 
> **a)** Draw $\Delta^2$ and $X$ side by side and make clear the difference.
> **b)** Write down the data for $X$ as a simplical complex. In other words what
> are the sets $X_0$, $X_1$, $X_2$... ?

$\Delta^2$ has 
 - $X_0 = \\{1,2,3\\}$, 
 - $X_1 = \\{\\{1,2\\},\\{2,3\\},\\{3,1\\}\\}$, 
 - $X_2 = \\{\\{1,2,3\\}\\}$, 
 - $X_3 = X_4 = X_5 ... = \emptyset$.

$\Delta^2$ could be rendered as a triangle with three edges between three
points. It is filled-in, since it contains one face in $X_2$.

But $X  = \partial\Delta^2$ has
 - $X_0 = \\{1,2,3\\}$,
 - $X_1 = X_2 = X_3 ... = \emptyset$.

$\partial\Delta^2$ could be rendered as three points. There are no edges and no
faces.
 
<hr/>

# 2.7.4.12 

> Let $f: A \to \Omega$ denote the characteristic function of some $A' \subseteq
> A$, and Define $A'' \subseteq A$ to be its complement, $A'' := A - A'$, (i.e.
> $a \in A''$ iff $a \neq A'$).
> 
> **a)** What is the characteristic function of $A'' \subseteq A$?  
> **b)** Can you phrase it in terms of some function $\Omega\to\Omega$?

Let there be a negation function $\neg:\Omega\to\Omega$ where $\neg(\text{True})
= \text{False}$ and $\neg(\text{False}) = \text{True}$.

Given the characteristic function $f_{A'}$ on $A' \subseteq A$, we could write
the characteristic function $f_{A''} = \neg \circ f_{A'}$, or $\neg f_{A'}$ for
short.

<hr/>

# 2.7.5.6 

> Show, in analogy to Proposition 2.7.5.5, that pushouts preserve epimorphisms.

<hr/>

# 2.7.5.9 

> Consider the subobject classifier $\Omega$, the singleton $\\{1\\}$ and the
> map $\\{1\\} \xrightarrow{\text{True}} \Omega$ from Definition 2.7.4.9. Look
> at diagram 2.44 and in the spirit of Exercise 2.7.5.7., come up with a label
> for $\Omega$, a label for $\\{1\\}$, and a label for $\text{True}$. Given a
> label for $X$ and a label for $f$, come up with a label for $A$, a label for
> $i$, and a label for $f'$, such that the English smoothly fits the
> mathematics.

<hr/>

# 2.7.6.2 

> **a)** Come up with some notion of mapping for multisets that generalizes
> functions when the notion is restricted to sets.
> 
> **b)** Suppose that $X = (1,1,2,3)$ and $Y = (a,b,b,b)$, i.e. $X =
> \\{1,2,3\\}$ with $1$ having multiplicity $2$, and $Y = \\{a,b\\}$ with $b$
> having multiplicity $3$. What are all the maps $X\to Y$ in your notion?

<hr/>

# 2.7.6.4 

> Suppose that a pseudo-multiset is defined to be almost the same as a multiset,
> except that $\pi$ is not required to be surjective.
> 
> **a)**  Write down a pseudo-multiset that is not a multiset.
> 
> **b)** Describe the difference between the two notions in terms of
> multiplicities.
> 
> **c)** Complexity of names aside, which do you think is a more useful notion:
> multiset or pseudo-multiset?

<hr/>

# 2.7.6.5 

> Consider the multisets described in Exercise 2.7.6.2.
> 
> **a)** Write each of them in the form $(E,B,\pi)$, as in Definition 2.7.6.3.
> 
> **b)** In terms of the same definition, what are the mappings $X\to Y$?
> 
> **c)** If we remove the restriction that diagram 2.45 must commute, how many
> mappings $X\to Y$ are there?

<hr/>

# 2.7.6.8 

> Given sets $X,Y,Z$ and functions $f:X\to Y$ and $g:Y\to Z$, we can compose
> them to get a function $X\to Z$. If $B$ is a set, if $(X,p)$, $(Y,q)$ and
> $(Z,r)$ are relative sets over $B$, and if $f: (X,p) \to (Y,q)$ and $g:
> (Y,q)\to (Z,r)$ are mappings, is there a reasonable notion of composition such
> that we get a mapping of relative sets over $(X,p)\to(Z,r)$? Draw diagrams.

<hr/>

# 2.7.6.9

> **a)** Let $\\{1\\}$ denote a set with one element. What is the difference
> between sets over $\\{1\\}$ and simply sets?
> 
> **b)** Describe the sets relative to $\emptyset$. How many are there?

<hr/>

# 2.7.6.13 

> Let $\\{1\\}$ denote a one-element set. What are $\\{1\\}$-indexed stes and
> mappings between them?

<hr/>

# 2.7.6.14 

> There is a strong relationship between $A$-indexed sets and relative sets over
> $A$. What is it?

