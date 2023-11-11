/* eslint-disable no-useless-escape */
const sampleMarkdown = `
An h1 header
============

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺



An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

~~~
define foobar() {
    print "Welcome to flavor country!";
}
~~~

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
~~~



### An h3 header ###

Now a nested list:

 1. First, get these ingredients:

      * carrots
      * celery
      * lentils

 2. Boil some water.

 3. Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].

[^1]: Footnote text goes here.

Tables can look like this:

size  material      color
----  ------------  ------------
9     leather       brown
10    hemp canvas   natural
11    glass         transparent

Table: Shoes, their sizes, and what they're made of

(The above is the caption for the table.) Pandoc also supports
multi-line tables:

--------  -----------------------
keyword   text
--------  -----------------------
red       Sunsets, apples, and
          other red or reddish
          things.

green     Leaves, grass, frogs
          and other things it's
          not easy being.
--------  -----------------------

A horizontal rule follows.

***

Here's a definition list:

apples
  : Good for making applesauce.
oranges
  : Citrus!
tomatoes
  : There's no "e" in tomatoe.

Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)

Here's a "line block":

| Line one
|   Line too
| Line tree

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.
`


export default [
  {
    id: '4cfbe3a5-7935-4bb6-b64b-67cb6787018f',
    name: 'Blur',
    slug: 'blur',
    description: sampleMarkdown,
    version: '0.0.1',
    license: 'MIT',
    repository: 'https://github.com/hexagon/croner',
    numberOfProjectsUsing: 500,
    lastModifiedTime: '50 minutes'
  },
  {
    id: 'baebfe64-02e7-4eb2-8700-da6f709b98b2',
    name: 'Crop',
    slug: 'crop',
    description: sampleMarkdown,
    version: '0.0.1',
    license: 'MIT',
    repository: 'https://github.com/hexagon/croner',
    numberOfProjectsUsing: 312,
    lastModifiedTime: '1 hour'
  },
  {
    id: 'fd54f26f-3963-437f-be04-b1d396013625',
    name: 'Grayscale',
    slug: 'grayscale',
    description: sampleMarkdown,
    version: '0.0.1',
    license: 'MIT',
    repository: 'https://github.com/hexagon/croner',
    numberOfProjectsUsing: 7,
    lastModifiedTime: '50 minutes'
  },
  {
    id: '7aebf670-2405-4c85-9504-d37a26a046dc',
    name: 'Rotate90',
    slug: 'rotate90',
    description: sampleMarkdown,
    version: '0.0.1',
    license: 'MIT',
    repository: 'https://github.com/hexagon/croner',
    numberOfProjectsUsing: 2,
    lastModifiedTime: '3 hours'
  }
  // {
  //   id: '4cfbe3a5-7935-4bb6-b64b-67cb6787018f',
  //   name: 'Encrypt',
  //   slug: 'encrypt',
  //   description: sampleMarkdown,
  //   version: '0.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 500,
  //   lastModifiedTime: '50 minutes'
  // },
  // {
  //   id: 'baebfe64-02e7-4eb2-8700-da6f709b98b2',
  //   name: 'Decrypt',
  //   slug: 'decrypt',
  //   description: sampleMarkdown,
  //   version: '2.2.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 312,
  //   lastModifiedTime: '1 hour'
  // },
  // {
  //   id: 'fd54f26f-3963-437f-be04-b1d396013625',
  //   name: 'UUID',
  //   slug: 'uuid',
  //   description: sampleMarkdown,
  //   version: '8.0.11',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 7,
  //   lastModifiedTime: '50 minutes'
  // },
  // {
  //   id: '7aebf670-2405-4c85-9504-d37a26a046dc',
  //   name: 'Deterministic Wasm',
  //   slug: 'deterministic-wasm',
  //   description: sampleMarkdown,
  //   version: '9.5.4',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 2,
  //   lastModifiedTime: '3 hours'
  // },
  // {
  //   id: 'f800a3b0-45a1-4329-9d09-c4f488bde2bd',
  //   name: 'OneSignal',
  //   slug: 'onesignal',
  //   description: sampleMarkdown,
  //   version: '1.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 34,
  //   lastModifiedTime: '1 day'
  // },
  // {
  //   id: 'e48fed55-7e08-45c0-8ee0-cf61f58898ff',
  //   name: 'Cron',
  //   slug: 'cron',
  //   description: sampleMarkdown,
  //   version: '7.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 120,
  //   lastModifiedTime: '10 days'
  // },
  // {
  //   id: 'ff3f0937-7397-466a-905d-e20f0c7cece8',
  //   name: 'DNS',
  //   slug: 'dns',
  //   description: sampleMarkdown,
  //   version: '0.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 500,
  //   lastModifiedTime: '50 minutes'
  // },
  // {
  //   id: '18365293-75ca-4a0f-a4ec-ac11b75634c5',
  //   name: 'GET',
  //   slug: 'get',
  //   description: sampleMarkdown,
  //   version: '2.2.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 312,
  //   lastModifiedTime: '1 hour'
  // },
  // {
  //   id: 'c0e132c8-db1d-4013-9252-9d2281016e17',
  //   name: 'PUT',
  //   slug: 'put',
  //   description: sampleMarkdown,
  //   version: '8.0.11',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 7,
  //   lastModifiedTime: '50 minutes'
  // },
  // {
  //   id: '24938f66-8be8-4306-8fe3-0690d5fc9b1e',
  //   name: 'POST',
  //   slug: 'post',
  //   description: sampleMarkdown,
  //   version: '9.5.4',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 2,
  //   lastModifiedTime: '3 hours'
  // },
  // {
  //   id: 'bd7eaa8a-6ae9-408e-b0a8-20bdede76171',
  //   name: 'PATCH',
  //   slug: 'patch',
  //   description: sampleMarkdown,
  //   version: '1.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 34,
  //   lastModifiedTime: '1 day'
  // },
  // {
  //   id: 'f8fed24b-5451-4217-b134-4e21e31760bf',
  //   name: 'DELETE',
  //   slug: 'delete',
  //   description: sampleMarkdown,
  //   version: '7.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 120,
  //   lastModifiedTime: '10 days'
  // },
  // {
  //   id: '3af0cecc-1a2e-4c06-b5a4-72254e533a24',
  //   name: 'Image Compressor',
  //   slug: 'image-compressor',
  //   description: sampleMarkdown,
  //   version: '0.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 500,
  //   lastModifiedTime: '50 minutes'
  // },
  // {
  //   id: '86d03207-32ed-45cd-813d-96d75e00e85c',
  //   name: 'Slack Bot',
  //   slug: 'slackbot',
  //   description: sampleMarkdown,
  //   version: '2.2.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 312,
  //   lastModifiedTime: '1 hour'
  // },
  // {
  //   id: '7e378ef9-7e1a-4037-a1d7-2eee71480eae',
  //   name: 'Discord Bot',
  //   slug: 'discord-bot',
  //   description: sampleMarkdown,
  //   version: '8.0.11',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 7,
  //   lastModifiedTime: '50 minutes'
  // },
  // {
  //   id: '8a927826-5f5e-4998-b780-a345c3c4326c',
  //   name: 'Github Actions',
  //   slug: 'github-actions',
  //   description: sampleMarkdown,
  //   version: '9.5.4',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 2,
  //   lastModifiedTime: '3 hours'
  // },
  // {
  //   id: 'cf141b54-1874-4c94-8e19-4aa932cc1e28',
  //   name: 'Web3.Storage',
  //   slug: 'web3-storage',
  //   description: sampleMarkdown,
  //   version: '1.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 34,
  //   lastModifiedTime: '1 day'
  // },
  // {
  //   id: '2c0f03c9-1dcf-41de-b75b-7e15afc0df79',
  //   name: 'NFT.Storage',
  //   slug: 'nft-storage',
  //   description: sampleMarkdown,
  //   version: '7.0.1',
  //   license: 'MIT',
  //   repository: 'https://github.com/hexagon/croner',
  //   numberOfProjectsUsing: 120,
  //   lastModifiedTime: '10 days'
  // }
]
