---
layout: default
---

<div class="card">
 <div class="card-body">
 <h5 class="card-title">
  Class notes
  <small class="text-muted"> for 
   <i>Category Theory for Scientists</i><br/>
   2019-05-27 -- 2019-??-??
  </small>
 </h5>
 <p class="card-text" markdown="1"> These are solutions to problems from the MIT OpenCourseware course [_Category Theory for Scientists_](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/index.htm). </p>
 <p class="card-text" markdown="1"> You can follow along with the [textbook](https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/) at home. </p>
 <p class="card-text" markdown="1"> All solutions are my own; feel free to [email me](mailto:james.adam.buckland@gmail.com) with corrections. </p>
 </div>
 <ul class="list-group list-group-flush">
 	<li class="list-group-item">
   <a href="https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/">
    Homepage
   </a>
  </li>
 	<li class="list-group-item">
   <a href="https://ocw.mit.edu/courses/mathematics/18-s996-category-theory-for-scientists-spring-2013/textbook/MIT18_S996S13_textbook.pdf">
    Textbook
   </a>
  </li>
 </ul>
 <div class="card-body">
  <h6>Solutions</h6>
  {% for p in site.ctfs %}
   <a class="card-link" href="{{ p.url }}"> {{ p.problem }} </a>
  {% endfor %}
 </div>
</div>
