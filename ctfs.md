---
layout: default
---
{% assign textbook_obj = site.data.textbooks.ctfs %}

## Class notes from _Category Theory for Scientists_

<p class="" markdown="1">
  This page includes solutions from {{textbook_obj.author}}'s
  [{{textbook_obj.title}}]({{textbook_obj.link}}) ({{textbook_obj.year}}),
  hosted on {{textbook_obj.hosted_on}}. See the
  [textbook]({{textbook_obj.textbook}}).
</p>

{% assign ps = site.ctfs | map: "problem" %}

<ul>
  {% for c in textbook_obj.chapters %}
    <li class="list-unstyled py-1">
      <span>
        <span class="text-muted">
          {{ forloop.index }})
        </span>
        {{ c.title }}
      </span>
      {% if c.chapters %}
        {% assign cindex = forloop.index %}
        <ul>
          {% for cc in c.chapters %}
            <li class="list-unstyled py-1"> 
              <span>
                <span class="text-muted">
                  {{ cindex }}.{{ forloop.index }})
                </span>
                {{ cc.title }}
              </span>
              {% if cc.chapters %}
                {% assign ccindex = forloop.index %}
                <ul>
                  {% for ccc in cc.chapters %}
                    <li class="list-unstyled py-1"> 
                      <span>
                        <span class="text-muted">
                          {{ cindex }}.{{ ccindex }}.{{ forloop.index }})
                        </span>
                        {{ ccc.title }}
                      </span>
                      {% assign prefix = "p" | append: cindex | append: "." 
                                       | append: ccindex | append: "." 
                                       | append: forloop.index %}
                      <ul class="list-inline">
                      {% for ps in site.ctfs %}
                        {% if ps.qed %}
                          {% assign item = "p" | append: ps.problem %}
                          {% if item contains prefix %}
                              <li class="list-inline-item py-1">
                                <a href="{{ ps.url }}">
                                  {{ ps.problem }}
                                </a>
                              </li>
                          {% endif %}
                        {% endif %}
                      {% endfor %}
                      </ul>
                    </li>
                  {% endfor %}
                </ul>
              {% endif %}
            </li>
          {% endfor %}
        </ul>
      {% endif %}
    </li>
  {% endfor %}
</ul>
