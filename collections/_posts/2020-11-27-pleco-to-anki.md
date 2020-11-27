---
title: A Pleco-to-Anki flash card creator
icon: fish

layout: post
---

{% include project.html github="https://github.com/ambuc/pleco-to-anki" %}

## Background

When I am learning a new word in Chinese, I usually look it up in
[Pleco](https://www.pleco.com/products/pleco-for-android/) and hit the `[+]`
button to create a flash card. Pleco is extremely useful for generating flash 
cards, but I prefer to use [Anki](https://apps.ankiweb.net/), which lets me
review those flash cards using
[spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition).

Both Pleco and Anki have Android apps, but there is no native interface between
them. Pleco exports a complex XML file with a lot of metadata. Anki expects to
import a CSV file which maps to your custom note.

### Anki

In Anki terminology, a **note** is a set of two or more fields:

```
# type: Note
French: Bonjour
English: Hello
Page: 12
```

and a **card** is a view into that note via a **card type**:

```
# type: Card Type
Q: French
A: English<br>
   Page #Page
```

```
# type Card
Q: Bonjour
A: Hello
   Page #12
```

It is normal to have a few card types, which represent a few views into that
note which you are trying to memorize.

### Anki for Chinese

My Chinese-language notecards have three fields:

```
# type: Note
characters: 苹果
pinyin: <font color="green">píng</font><font color="blue">guǒ</font>
meaning: noun apple
```

where the `characters` field contains CJK unicode, and the `pinyin` field is
HTML. Anki will render these fields correctly on web and mobile.

I have four card types:

```
Q: characters + meaning
A: pinyin

Q: characters + pinyin
A: meaning

Q: pinyin + meaning
A: characters

Q: characters
A: pinyin + meaning
```

It doesn't make sense to have a card where `Q: pinyin`, since the
question is ambiguous -- there are many words and characters with the same
pronunciation.  I think it also doesn't make sense to have a card where `Q:
meaning`, since there are many ways to say the same idea in each
language.

## Problem statement

In Pleco, a flash card looks like this:

<center>
<img src="/assets/images/pleco-to-anki/pleco.png" height="400px"/>
</center>
<br/>

Pleco can export your set of saved flash cards, but it does so as XML:

```xml
<?xml version="1.0" ?>
<plecoflash formatversion="2" creator="Pleco User -1" generator="Pleco 2.0 Flashcard Exporter" platform="Android" created="1605883885">
  <categories/>
  <cards>
    <card language="chinese">
      <entry>
        <headword charset="sc">感冒</headword>
        <headword charset="tc">感冒</headword>
        <pron type="hypy" tones="numbers">gan3mao4</pron>
        <defn>noun common cold verb 1 catch cold 2 dialect be interested in; like (usu. used in the negative)</defn>
      </entry>
      <dictref dictid="PACE" entryid="21428224"/>
    </card>
  </cards>
</plecoflash>
```

where each `<card>` entry is a rich object with (1) `sc` (simplified
Chinese) and `tc` (traditional Chinese) characters, (2) a pinyin string in
which the numeral following a syllable denotes its tone, and (3) a dictionary
definition.

Anki, on the other hand, prefers to import data as a CSV (comma-separated or
semicolon-separated is fine), where each columns maps to a field in the
destination note. The above example as CSV might look like:

```csv
<span><font color="blue">găn</font></span> <span><font color="purple">mào</font></span>;感冒;noun common cold verb 1 catch cold 2 dialect be interested in.
```

This might render in Anki like so:

<center>
<img src="/assets/images/pleco-to-anki/anki.png" height="400px"/>
</center>
<br/>

## Solution

I wrote [pleco-to-anki](https://github.com/ambuc/pleco-to-anki), a Python script
which converts an XML file with a `plecoflash` object to a CSV file suitable for
import.

### Requirements

*  I want to test myself on a character's tones, but I don't want to use the
   style of pinyin in which tones have numbers. I prefer to read the tones as
   diacritics over vowels, i.e. the pinyin for 苹果 should appear as píngguǒ,
   not ping2guo3.
*  I like the convention where syllables are colored based on their tone.
   Everyone has their own convention, but for me red=flat, green=rising, 
   blue=u-shaped, purple=falling, and grey=neutral. I want these flash cards to
   have colored pinyin syllables, but not colored Chinese characters.

### Gotchas

*  [`u`](https://resources.allsetlearning.com/chinese/pronunciation/The_%22o%22_and_%22u%22_vowels)
   and [`ü`](https://resources.allsetlearning.com/chinese/pronunciation/The_%22%C3%BC%22_vowel)
   are two different vowels in pinyin and the difference must be
   preserved. For example, 旅游 can be written as "lǚyóu": note the
   diaeresis (¨) _and_ háček (ˇ) over the letter 'u'.
*  The dictionary definition which Pleco provides often repeats the Chinese 
   characters: it is unsuitable as a question if it contains or hints at the
   answer. 

## Conclusion

Hopefully [pleco-to-anki](https://github.com/ambuc/pleco-to-anki/) can benefit
you as well as me. Please leave me a
[PR or open an issue](https://github.com/ambuc/pleco-to-anki/pulls) if you catch
a bug or encounter difficulty using this tool.
