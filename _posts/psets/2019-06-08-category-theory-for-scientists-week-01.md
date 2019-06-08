---
title: Category Theory for Scientists, Week 01
layout: post
icon: project-diagram
categories: [psets]
tags: mathematics category-theory
---

This post will work through week one of the MIT OpenCourseware 2013 course
[_Category Theory for
Scientists_](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/index.htm). Those following along can see the textbook [online](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/).

 - Readings: [Chapter
   1](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_chapter1.pdf)–[Chapter 2.2](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_chapter2.pdf)
 - Homework assignments: All exercises in sections 2.1, 2.2

<h1 id="hide">&nbsp;</h1> <!-- Hide 1.0 -->

# The category of sets <!-- 2 -->

## Sets and functions <!-- 2.1 -->

### Sets <!-- 2.1.1 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.1.1 -->

####  <!-- 2.1.1.2 -->
Let $A = {1,2,3}$. What are all the subsets of $A$? Hint: there are 8.  

> Any element $a$ either _is_ or _is not_ included in a subset $A' \in A$. With
> two choices per element, there are $2^{|A|} = 2^3 = 8$ possible subsets.

### Functions <!-- 2.1.2 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.1 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.2 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.3 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.4 -->

####  <!-- 2.1.2.5 -->
If $f: X \to Y$ is depicted with $x_1 \to y_1, x_2 \to y_2, x_3 \to y_4, x_4 \to
y_1$, write its image, $\im{f}$ as a set.

> Since 
> $\im{f} := \\{y \in Y \mid \exists x \in X \text{ such that } f(x) = y\\}$, 
> and since no element in $X$ maps to $y_5$, the image of $f$ is 
> $\\{y_1, y_2, y_3, y_4\\}$.

####  <!-- 2.1.2.6 -->
Let $A = \\{1,2,3,4,5\\}$ and $B = \\{x,y\\}$. 

How many elements does $\hom_\bset(A, B)$ have? 

> $\hom_\bset(X, Y)$ is the set of functions $X \to Y$. For any function 
> $X \to Y$, each element $x \in X$ must be mapped to an element in $Y$, of 
> which there are $|Y|$ choices. So the cardinality 
> $|\hom_\bset(X,Y)| = |Y|^{|X|}$. So 
> $|\hom_\bset(A,B)| = |B|^{|A|} = 2^5 = 32$.

How many elements does $\hom_\bset(B, A)$ have?

> See 
> $|\hom_\bset(B,A)| = |A|^{|B|} = 5^2 = 25$.

####  <!-- 2.1.2.7 -->
Find a set $A$ such that for all sets $X$ there is exactly one element in
$\hom_\bset(X, A)$.

> The set $A = \\{1\\}$ satisfies this condition. 
> $|\hom_\bset(X, A)| = |A|^{|X|} = 1^x = 1$.

Find a set $B$ such that for all sets $X$ there is exactly one element in
$\hom_\bset(B, X)$.

> The set $B = \emptyset$.
> 
> Observe $|\hom_\bset(B,X)| = |X|^{|B|} = |X|^0 = 1$.
> There is only one way to map the empty set; an empty mapping with no arrows
> at all.

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.8 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.9 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.10 -->

####  <!-- 2.1.2.11 -->
Let $n \in \N$ be a natural number and let $X$ be a set with exactly $n$
elements.

How many isomorphisms are there from $X$ to itself?

> An _isomorphism_ is a function which is invertible, i.e. a one-to-one
> correspondence. For the first element in $X$, there are $|X|$ choices; for the
> second element, $|X|-1$ choices, etc. Let us assign $n := |X|$. So the total
> number of choices is $n (n-1) (n-2) ... (1)$ 
> $= \frac{n(n+1)}{2} = {n + 1 \choose 2}$.

Does your formula from part _a)_ hold when $n=0$?

> No, since ${0 \choose 2} = 0$ -- but there is one isomorphism, the set of no 
> arrows.

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.12 -->

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.13 -->

####  <!-- 2.1.2.14 -->
Find a set $A$ such that for any set $X$ there is an isomorphism of sets
$X \cong \hom_\bset(A, X)$.

> The set $A = \\{1\\}$ satisfies this condition. In order for an isomorphism to
> exist, there must be an obvious one-to-one mapping between elements. If there
> is only one element in $A$, there are $|X|$ mappings from $A \to X$, i.e. from
> the element $1$ to each element $x \in X$. This means 
> $|X| = |\hom_\bset(A, X)|$.

####  <!-- 2.1.2.15 -->
Let $A = \\{a,b,c,d\\}$. If $f: \underline{10} \to A$ is given by 
$(a,b,c,c,b,a,d,d,a,b)$, what is $f(4)$?

> Since $\underline{n} := \\{1,2,3...n\\}$, where $f(n)$ is the $n$th element
> in the sequence given by $f$, $f(4) = c$.

Let $s: \underline{7} \to \N$ be given by $s(i) = i^2$. Write $s$ out as a
sequence.

> $s: \underline{7} \to \N = (1^2, 2^2, 3^2, 4^2, 5^2, 6^2, 7^2)$
> $= (1,4,9,16,25,36,49)$.

<h4 id="hide">&nbsp;</h4> <!-- Hide 2.1.2.16 -->

####  <!-- 2.1.2.17 -->
Let $A = \\{5,6,7\\}$. 
What is $|A|$?

> The size of $A$ 
> is $|A| = 3$.

What is 
$|\N|$?

> The size of the set of natural numbers $\N$ is defined as $\aleph_0$ .

What is 
$|\\{n \in \N \mid n \leqslant 5\\}|$ ?

> See 
> $|\\{1,2,3,4,5\\}| = 5$ .
