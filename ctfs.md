---
layout: default
---
{% assign ctfs = site.data.textbooks.ctfs %}

<p class="" markdown="1">
This page includes solutions from {{ctfs.author}}'s
[{{ctfs.title}}]({{ctfs.link}}) ({{ctfs.year}}), hosted on {{ctfs.hosted_on}}.
See the [textbook]({{ctfs.textbook}}).
</p>

<div>
{% for p in site.ctfs %}
<a class="btn btn-link" href="{{p.url}}">{{p.problem}}</a>
{% endfor %}
</div>
