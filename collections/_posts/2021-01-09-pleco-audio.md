---
title: Anki flash cards with audio
icon: language

layout: post
---

{% include project.html github="https://github.com/ambuc/pleco-to-anki" %}

Here I discuss how I got audio samples working in Anki (for Mac OS X) and
AnkiDroid (for Android).

## Using `say`:

Mac OS comes with a text-to-speech utility, `say`. Say supports a few voices,
many of which are tailored to specific languages. I ran:

```
$ say -v "?" | grep zh_
Mei-Jia    zh_TW  # 您好，我叫美佳。我說國語。 
Sin-ji     zh_HK  # 您好，我叫 Sin-ji。我講廣東話。 
Ting-Ting  zh_CN  # 您好，我叫Ting-Ting。我讲中文普通话。
```

It looks like `Ting-Ting` is the best match, since I want to render audio with a
_mainland_ Chinese accent. So we can render and save an audio sample with:

```
/usr/bin/say -v Ting-Ting "拼音" -o ~/path/to/output
```

I wanted to avoid the cost of converting the generated audio file, since there
would be as many unique files as there are flash cards. I used `.flac` since it
was the only format which `say` can natively render on Mac OS X _and_ which
Android (and, by extension AnkiDroid, running on Android) can open.

## Saving to Anki

Anki looks for media at a path which
[varies per-platform](https://docs.ankiweb.net/#/files?id=file-locations). 
Since I'm on Mac OS X, I need to save my samples to 
`~/Library/Application Support/Anki2/User 1/media.collection/<file>.flac`.

In Anki, you can use the special embed syntax `[sound:<file>]` which renders a
system-native audio player. If the field containing that embed is on the front
of a card, it will play when the card first appears; otherwise it will play when
the reverse of the card is revealed.

## Conclusion

I ended up writing this behavior directly into
[pleco-to-anki](https://github.com/ambuc/pleco-to-anki), which now
generate the audio samples, save them to `~/Library/Application
Support/Anki2/media.collection`, and generate a `.csv` with a column containing
embed syntax as specified above. You may need to adapt this workflow for your
own platform and card/field format.

