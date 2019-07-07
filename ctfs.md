---
layout: default
---

<div class="container">
  {% include candybar.html icon="calculator"
     title="Class Notes and Solutions"
     textbook="ctfs"
     date="2019-05-27"
     %}
  
  <br/>
  
  <p>
    <ul class="list-inline">
      {% for p in site.ctfs %}
        <li class="list-inline-item">
          <a class="btn btn-link" href="{{ p.url }}" role="button">
            {{ p.problem }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </p>
</div>
