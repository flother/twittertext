TwitterText is two things.  Firstly, it's a copy of Twitter's own [text conformance tests] [1] rewritten in Javascript suitable for using with Node.js.  Secondly, it's a Node.js module that passes all those tests, therefore allowing you to parse Twitter messages.

If that hasn't got you excited perhaps an example will.

    # Import the module.
    var twittertext = require("twittertext");
    # Create a Twitter message.
    var message = twittertext.Message("@riggbot Look at this example message with @replies, #hashtags, and mentions: @borgar @bengoldacre @stephenfry");
    # Which users were mentioned in the message?
    message.mentions;
    ["riggbot", "replies", "borgar", "bengoldacre", "stephenfry"]
    # What hashtags were there?
    message.hashtags
    ["hashtags"]
    # Was it a reply to someone?
    message.replies
    ["riggbot"]
    # Did it include any URLs?
    message.urls
    []

It will even convert the message into HTML for you:

    var message = twittertext.Message("Hayley Mustafa writes, why do you look so much like my dad @isaiahmustafa? http://www.youtube.com/watch?v=JvuYcbgZl-U")
    message.html
    'Hayley Mustafa writes, why do you look so much like my dad @<a class="tweet-url username" href="http://twitter.com/isaiahmustafa">isaiahmustafa</a>? <a href="http://www.youtube.com/watch?v=JvuYcbgZl-U">http://www.youtube.com/watch?v=JvuYcbgZl-U</a>'

There are three caveats.

First, the library doesn't include the ["hit highlighting" tests] [2].  The hit highlighting tests are for highlighting search terms within a message, and frankly we don't find them either useful or interesting.

Secondly, we don't include support for [hashtag indices] [3].  Again, they're neither useful nor interesting.

Finally, the library currently fails two tests.  They're pretty obscure so you may not even notice the missing functionality (and we are aiming to pass them eventually) but if you're worried you can see them in the code:

1. Missing test one: [auto-link URL within Japanese text] [4]
2. Missing test two: [do not extract a URL starting with a dash] [5]

(Note that the second failure is not a limitation of this library but due to an bug in the test itself.)

[1]: http://github.com/mzsanford/twitter-text-conformance
[2]: http://github.com/mzsanford/twitter-text-conformance/blob/master/hit_highlighting.yml
[3}: http://github.com/mzsanford/twitter-text-conformance/commit/50a54a8f39b34e5e2c4e374bab9348a787e82a26
[4]: http://github.com/flother/twittertext/blob/master/test/autolink.js#L278
[5]: http://github.com/flother/twittertext/blob/master/test/extract.js#L302
