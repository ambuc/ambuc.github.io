---
layout: default
---

These are solutions to problems from the MIT OpenCourseware course [_Category
Theory for
Scientists_](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/index.htm).

You can follow along with the
[textbook](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/)
at home.

All solutions are my own; feel free to [email
me](mailto:james.adam.buckland@gmail.com) with corrections.

<blockquote>
<ul class="list-inline">
	{% for p in site.ctfs %}
		<li class="list-inline-item">
			<a class="btn btn-link" href="{{ p.url }}" role="button">
			 {{ p.problem }}
			</a>
		</li>
	{% endfor %}
</ul>
</blockquote>
