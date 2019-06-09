---
title: Category Theory for Scientists, Week 01
layout: post
icon: project-diagram
categories: Psets
tags: mathematics category-theory ctfs-2013
---

This pset works through Week 01 of [_Category Theory for Scientists_][1]. You
can follow along with the [textbook][2] at home. [Week 01][3] covers [Chapter
1][4]–[Chapter 2.2][5] and all exercises in sections 2.1, 2.2. All solutions are
my own; feel free to [email me](james.adam.buckland@gmail.com) with corrections.

[1]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/index.htm
[2]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/
[3]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/readings/
[4]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_chapter1.pdf
[5]: https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_chapter2.pdf

<h1 id="hide">&zwj;</h1> <!-- Hide 1.0 -->

# The category of sets <!-- 2 -->

## Sets and functions <!-- 2.1 -->

### Sets <!-- 2.1.1 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.1.1 -->

####  <!-- 2.1.1.2 -->
Let $A = {1,2,3}$. What are all the subsets of $A$? Hint: there are 8.  

> Any element $a$ either _is_ or _is not_ included in a subset $A' \in A$. With
> two choices per element, there are $2^{|A|} = 2^3 = 8$ possible subsets.

### Functions <!-- 2.1.2 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.1 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.2 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.3 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.4 -->

####  <!-- 2.1.2.5 -->
If $f: X \to Y$ is depicted with $x_1 \to y_1, x_2 \to y_2, x_3 \to y_4, x_4 \to
y_1$, write its image, $\im{f}$ as a set.

> Since 
> $\im{f} := \\{y \in Y \mid \exists x \in X \text{ such that } f(x) = y\\}$, 
> and since no element in $X$ maps to $y_5$, the image of $f$ is 
> $\\{y_1, y_2, y_3, y_4\\}$.

####  <!-- 2.1.2.6 -->
Let $A = \\{1,2,3,4,5\\}$ and $B = \\{x,y\\}$. 

**a)** How many elements does $\hbs(A, B)$ have? 

> $\hbs(X, Y)$ is the set of functions $X \to Y$. For any function 
> $X \to Y$, each element $x \in X$ must be mapped to an element in $Y$, of 
> which there are $|Y|$ choices. So the cardinality 
> $|\hbs(X,Y)| = |Y|^{|X|}$. So 
> $|\hbs(A,B)| = |B|^{|A|} = 2^5 = 32$.

**b)** How many elements does $\hbs(B, A)$ have?

> &zwj;
> $|\hbs(B,A)| = |A|^{|B|} = 5^2 = 25$.

####  <!-- 2.1.2.7 -->
**a)** Find a set $A$ such that for all sets $X$ there is exactly one element in
$\hbs(X, A)$.

> The set $A = \\{1\\}$ satisfies this condition. 
> $|\hbs(X, A)| = |A|^{|X|} = 1^x = 1$.

**b)** Find a set $B$ such that for all sets $X$ there is exactly one element in
$\hbs(B, X)$.

> The set $B = \emptyset$.
> 
> Observe $|\hbs(B,X)| = |X|^{|B|} = |X|^0 = 1$.
> There is only one way to map the empty set; an empty mapping with no arrows
> at all.

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.8 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.9 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.10 -->

####  <!-- 2.1.2.11 -->
Let $n \in \N$ be a natural number and let $X$ be a set with exactly $n$
elements.

**a)** How many isomorphisms are there from $X$ to itself?

> An _isomorphism_ is a function which is invertible, i.e. a one-to-one
> correspondence. For the first element in $X$, there are $|X|$ choices; for the
> second element, $|X|-1$ choices, etc. Let us assign $n := |X|$. So the total
> number of choices is $n (n-1) (n-2) ... (1)$ 
> $= \frac{n(n+1)}{2} = {n + 1 \choose 2}$.

**b)** Does your formula from part _a)_ hold when $n=0$?

> No, since ${0 \choose 2} = 0$ -- but there is one isomorphism, the set of no 
> arrows.

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.12 -->

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.13 -->

####  <!-- 2.1.2.14 -->
Find a set $A$ such that for any set $X$ there is an isomorphism of sets
$X \cong \hbs(A, X)$.

> The set $A = \\{1\\}$ satisfies this condition. In order for an isomorphism to
> exist, there must be an obvious one-to-one mapping between elements. If there
> is only one element in $A$, there are $|X|$ mappings from $A \to X$, i.e. from
> the element $1$ to each element $x \in X$. This means 
> $|X| = |\hbs(A, X)|$.

####  <!-- 2.1.2.15 -->
**a)** Let $A = \\{a,b,c,d\\}$. If $f: \underline{10} \to A$ is given by 
$(a,b,c,c,b,a,d,d,a,b)$, what is $f(4)$?

> Since $\underline{n} := \\{1,2,3...n\\}$, where $f(n)$ is the $n$th element
> in the sequence given by $f$, $f(4) = c$.

**b)** Let $s: \underline{7} \to \N$ be given by $s(i) = i^2$. Write $s$ out as a
sequence.

> $s: \underline{7} \to \N = (1^2, 2^2, 3^2, 4^2, 5^2, 6^2, 7^2)$
> $= (1,4,9,16,25,36,49)$.

<h4 id="hide">&zwj;</h4> <!-- Hide 2.1.2.16 -->

####  <!-- 2.1.2.17 -->
Let $A = \\{5,6,7\\}$. 

**a)** What is 
$|A|$?

> &zwj;
> $|A| = 3$.

**b)** What is 
$|\N|$?

> &zwj;
> $|\N| := \aleph_0$.

What is 
$|\\{n \in \N \mid n \leqslant 5\\}|$ ?

> &zwj;
> $|\\{1,2,3,4,5\\}| = 5$ .
