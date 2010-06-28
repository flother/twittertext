var assert = require("assert");
var twittertext = require("../lib/twittertext")


// Autolink trailing username.
assert.equal(
    twittertext.autolink("text @username"),
    "text @<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// Autolink username at the beginning.
assert.equal(
    twittertext.autolink("@username text"),
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a> text"
);


// DO NOT Autolink username preceded by a letter.
assert.equal(
    twittertext.autolink("meet@the beach"),
    "meet@the beach"
);


// Autolink username preceded by puctuation.
assert.equal(
    twittertext.autolink("great.@username"),
    "great.@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// Autolink username followed by puctuation.
assert.equal(
    twittertext.autolink("@username&^$%^"),
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>&^$%^"
);


// Autolink username followed by Japanese.
assert.equal(
    twittertext.autolink("@usernameの"),
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>の"
);


// Autolink username preceded by Japanese.
assert.equal(
    twittertext.autolink("あ@username"),
    "あ@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// Autolink username surrounded by Japanese.
assert.equal(
    twittertext.autolink("あ@usernameの"),
    "あ@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>の"
);


// Autolink username with full-width at sign (U+FF20).
assert.equal(
    twittertext.autolink("＠username"),
    "＠<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// DO NOT Autolink username over 20 characters.
assert.equal(
    twittertext.autolink("@username9012345678901"),
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username901234567890\">username901234567890</a>1"
);


// Autolink list preceded by a space.
assert.equal(
    twittertext.autolink("text @username/list"),
    "text @<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>"
);


// DO NOT Autolink list when space follows slash.
assert.equal(
    twittertext.autolink("text @username/ list"),
    "text @<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>/ list"
);


// DO NOT Autolink list with empty username.
assert.equal(
    twittertext.autolink("text @/list"),
    "text @/list"
);


// Autolink list at the beginning.
assert.equal(
    twittertext.autolink("@username/list"),
    "@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>"
);


// DO NOT Autolink list preceded by letter.
assert.equal(
    twittertext.autolink("meet@the/beach"),
    "meet@the/beach"
);


// Autolink list preceded by puctuation.
assert.equal(
    twittertext.autolink("great.@username/list"),
    "great.@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>"
);


// Autolink list followed by puctuation.
assert.equal(
    twittertext.autolink("@username/list&^$%^"),
    "@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>&^$%^"
);


// Autolink list name over 80 characters (truncated to 80).
assert.equal(
    twittertext.autolink("@username/list5678901234567890123456789012345678901234567890123456789012345678901234567890A"),
    "@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list5678901234567890123456789012345678901234567890123456789012345678901234567890\">username/list5678901234567890123456789012345678901234567890123456789012345678901234567890</a>A"
);


// Autolink trailing hashtag.
assert.equal(
    twittertext.autolink("text #hashtag"),
    "text <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>"
);


// Autolink alphanumeric hashtag (letter-number-letter).
assert.equal(
    twittertext.autolink("text #hash0tag"),
    "text <a href=\"http://twitter.com/search?q=%23hash0tag\" title=\"#hash0tag\" class=\"tweet-url hashtag\">#hash0tag</a>"
);


// Autolink alphanumeric hashtag (number-letter).
assert.equal(
    twittertext.autolink("text #1tag"),
    "text <a href=\"http://twitter.com/search?q=%231tag\" title=\"#1tag\" class=\"tweet-url hashtag\">#1tag</a>"
);


// Autolink hashtag with underscore.
assert.equal(
    twittertext.autolink("text #hash_tag"),
    "text <a href=\"http://twitter.com/search?q=%23hash_tag\" title=\"#hash_tag\" class=\"tweet-url hashtag\">#hash_tag</a>"
);


// DO NOT Autolink all-numeric hashtags.
assert.equal(
    twittertext.autolink("text #1234"),
    "text #1234"
);


// DO NOT Autolink hashtag preceded by a letter.
assert.equal(
    twittertext.autolink("text#hashtag"),
    "text#hashtag"
);


// Autolink multiple hashtags.
assert.equal(
    twittertext.autolink("text #hashtag1 #hashtag2"),
    "text <a href=\"http://twitter.com/search?q=%23hashtag1\" title=\"#hashtag1\" class=\"tweet-url hashtag\">#hashtag1</a> <a href=\"http://twitter.com/search?q=%23hashtag2\" title=\"#hashtag2\" class=\"tweet-url hashtag\">#hashtag2</a>"
);


// Autolink hashtag preceded by a period.
assert.equal(
    twittertext.autolink("text.#hashtag"),
    "text.<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>"
);


// DO NOT Autolink hashtag preceded by &.
assert.equal(
    twittertext.autolink("&#nbsp;"),
    "&#nbsp;"
);


// Autolink hashtag followed by ! (! not included).
assert.equal(
    twittertext.autolink("text #hashtag!"),
    "text <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>!"
);


// Autolink hashtag followed by Japanese.
assert.equal(
    twittertext.autolink("text #hashtagの"),
    "text <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>の"
);


// Autolink hashtag preceded by full-width space (U+3000).
assert.equal(
    twittertext.autolink("text　#hashtag"),
    "text　<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>"
);


// Autolink hashtag followed by full-width space (U+3000).
assert.equal(
    twittertext.autolink("#hashtag　text"),
    "<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>　text"
);


// Autolink hashtag with full-width hash (U+FF03).
assert.equal(
    twittertext.autolink("＃hashtag"),
    "<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">＃hashtag</a>"
);


// Autolink trailing url.
assert.equal(
    twittertext.autolink("text http://example.com"),
    "text <a href=\"http://example.com\">http://example.com</a>"
);


// Autolink url in mid-text.
assert.equal(
    twittertext.autolink("text http://example.com more text"),
    "text <a href=\"http://example.com\">http://example.com</a> more text"
);


// Autolink url in Japanese text.
assert.equal(
    twittertext.autolink("いまなにしてるhttp://example.comいまなにしてる"),
    "いまなにしてる<a href=\"http://example.com\">http://example.com</a>いまなにしてる"
);


// Autolink url surrounded by parentheses.
assert.equal(
    twittertext.autolink("text (http://example.com)"),
    "text (<a href=\"http://example.com\">http://example.com</a>)"
);


// Autolink url containing unicode characters.
assert.equal(
    twittertext.autolink("I enjoy Macintosh Brand computers: http://✪df.ws/ejp"),
    "I enjoy Macintosh Brand computers: <a href=\"http://✪df.ws/ejp\">http://✪df.ws/ejp</a>"
);


// Autolink url with .co. under TLD.
assert.equal(
    twittertext.autolink("test http://www.example.co.jp"),
    "test <a href=\"http://www.example.co.jp\">http://www.example.co.jp</a>"
);


// DO NOT Autolink url containing ! character in the domain.
assert.equal(
    twittertext.autolink("badly formatted http://foo!bar.com"),
    "badly formatted http://foo!bar.com"
);


// DO NOT Autolink url containing _ character in the domain.
assert.equal(
    twittertext.autolink("badly formatted http://foo_bar.com"),
    "badly formatted http://foo_bar.com"
);


// Autolink url preceded by :.
assert.equal(
    twittertext.autolink("text:http://example.com"),
    "text:<a href=\"http://example.com\">http://example.com</a>"
);


// Autolink url followed by ? (without it).
assert.equal(
    twittertext.autolink("text http://example.com?"),
    "text <a href=\"http://example.com\">http://example.com</a>?"
);


// Autolink url followed by ! (without it).
assert.equal(
    twittertext.autolink("text http://example.com!"),
    "text <a href=\"http://example.com\">http://example.com</a>!"
);


// Autolink url followed by , (without it).
assert.equal(
    twittertext.autolink("text http://example.com,"),
    "text <a href=\"http://example.com\">http://example.com</a>,"
);


// Autolink url followed by . (without it).
assert.equal(
    twittertext.autolink("text http://example.com."),
    "text <a href=\"http://example.com\">http://example.com</a>."
);


// Autolink url followed by : (without it).
assert.equal(
    twittertext.autolink("text http://example.com:"),
    "text <a href=\"http://example.com\">http://example.com</a>:"
);


// Autolink url followed by ; (without it).
assert.equal(
    twittertext.autolink("text http://example.com;"),
    "text <a href=\"http://example.com\">http://example.com</a>;"
);


// Autolink url followed by ] (without it).
assert.equal(
    twittertext.autolink("text http://example.com]"),
    "text <a href=\"http://example.com\">http://example.com</a>]"
);


// Autolink url followed by ) (without it).
assert.equal(
    twittertext.autolink("text http://example.com)"),
    "text <a href=\"http://example.com\">http://example.com</a>)"
);


// Autolink url followed by } (without it).
assert.equal(
    twittertext.autolink("text http://example.com}"),
    "text <a href=\"http://example.com\">http://example.com</a>}"
);


// Autolink url followed by = (without it).
assert.equal(
    twittertext.autolink("text http://example.com="),
    "text <a href=\"http://example.com\">http://example.com</a>="
);


// Autolink url followed by ' (without it).
assert.equal(
    twittertext.autolink("text http://example.com'"),
    "text <a href=\"http://example.com\">http://example.com</a>'"
);


// DO NOT Autolink url preceded by /.
assert.equal(
    twittertext.autolink("text /http://example.com"),
    "text /http://example.com"
);


// DO NOT Autolink url preceded by !.
assert.equal(
    twittertext.autolink("text !http://example.com"),
    "text !http://example.com"
);


// DO NOT Autolink url preceded by =.
assert.equal(
    twittertext.autolink("text =http://example.com"),
    "text =http://example.com"
);


// Autolink url embedded in link tag.
assert.equal(
    twittertext.autolink("<link rel='true'>http://example.com</link>"),
    "<link rel='true'><a href=\"http://example.com\">http://example.com</a></link>"
);


// Autolink multiple urls.
assert.equal(
    twittertext.autolink("http://example.com https://sslexample.com http://sub.example.com"),
    "<a href=\"http://example.com\">http://example.com</a> <a href=\"https://sslexample.com\">https://sslexample.com</a> <a href=\"http://sub.example.com\">http://sub.example.com</a>"
);


// Autolink url with long TLD.
assert.equal(
    twittertext.autolink("http://example.mobi/path"),
    "<a href=\"http://example.mobi/path\">http://example.mobi/path</a>"
);


// Autolink url without protocol (with www).
assert.equal(
    twittertext.autolink("www.example.com"),
    "<a href=\"http://www.example.com\">www.example.com</a>"
);


// Autolink url without protocol (with WWW).
assert.equal(
    twittertext.autolink("WWW.EXAMPLE.COM"),
    "<a href=\"http://WWW.EXAMPLE.COM\">WWW.EXAMPLE.COM</a>"
);


// Multiple URLs with different protocols.
assert.equal(
    twittertext.autolink("http://foo.com AND https://bar.com AND www.foobar.com"),
    "<a href=\"http://foo.com\">http://foo.com</a> AND <a href=\"https://bar.com\">https://bar.com</a> AND <a href=\"http://www.foobar.com\">www.foobar.com</a>"
);


// Autolink raw domain followed by domain.
assert.equal(
    twittertext.autolink("See http://example.com example.com"),
    "See <a href=\"http://example.com\">http://example.com</a> example.com"
);


// Autolink url that includes @-sign and numeric dir under it.
assert.equal(
    twittertext.autolink("http://www.flickr.com/photos/29674651@N00/4382024406"),
    "<a href=\"http://www.flickr.com/photos/29674651@N00/4382024406\">http://www.flickr.com/photos/29674651@N00/4382024406</a>"
);


// Autolink url that includes @-sign and non-numeric dir under it.
assert.equal(
    twittertext.autolink("http://www.flickr.com/photos/29674651@N00/foobar"),
    "<a href=\"http://www.flickr.com/photos/29674651@N00/foobar\">http://www.flickr.com/photos/29674651@N00/foobar</a>"
);


// Autolink URL with only a domain followed by a period doesn't swallow the period..
assert.equal(
    twittertext.autolink("I think it's proper to end sentences with a period http://tell.me. Even when they contain a URL."),
    "I think it's proper to end sentences with a period <a href=\"http://tell.me\">http://tell.me</a>. Even when they contain a URL."
);


// Autolink URL with a path followed by a period doesn't swallow the period..
assert.equal(
    twittertext.autolink("I think it's proper to end sentences with a period http://tell.me/why. Even when they contain a URL."),
    "I think it's proper to end sentences with a period <a href=\"http://tell.me/why\">http://tell.me/why</a>. Even when they contain a URL."
);


// Autolink URL with a query followed by a period doesn't swallow the period..
assert.equal(
    twittertext.autolink("I think it's proper to end sentences with a period http://tell.me/why?=because.i.want.it. Even when they contain a URL."),
    "I think it's proper to end sentences with a period <a href=\"http://tell.me/why?=because.i.want.it\">http://tell.me/why?=because.i.want.it</a>. Even when they contain a URL."
);


// Autolink URL with a hyphen in the domain name.
assert.equal(
    twittertext.autolink("Czech out sweet deals at http://mrs.domain-dash.biz ok?"),
    "Czech out sweet deals at <a href=\"http://mrs.domain-dash.biz\">http://mrs.domain-dash.biz</a> ok?"
);


// Autolink URL should NOT autolink www...foo.
assert.equal(
    twittertext.autolink("Is www...foo a valid URL?"),
    "Is www...foo a valid URL?"
);


// Autolink URL should NOT autolink www.-foo.com.
assert.equal(
    twittertext.autolink("Is www.-foo.com a valid URL?"),
    "Is www.-foo.com a valid URL?"
);


// Autolink URL should autolink a domain with a valid dash.
assert.equal(
    twittertext.autolink("Is www.foo-bar.com a valid URL?"),
    "Is <a href=\"http://www.foo-bar.com\">www.foo-bar.com</a> a valid URL?"
);


// Autolink URL should link search urls (with &lang=, not &lang;).
assert.equal(
    twittertext.autolink("Check out http://search.twitter.com/search?q=avro&lang=en"),
    "Check out <a href=\"http://search.twitter.com/search?q=avro&lang=en\">http://search.twitter.com/search?q=avro&lang=en</a>"
);


// Autolink all does not break on URL with @.
assert.equal(
    twittertext.autolink("http://www.flickr.com/photos/29674651@N00/4382024406 if you know what's good for you."),
    "<a href=\"http://www.flickr.com/photos/29674651@N00/4382024406\">http://www.flickr.com/photos/29674651@N00/4382024406</a> if you know what's good for you."
);


// Autolink all does not allow & without ?.
assert.equal(
    twittertext.autolink("Check out: http://example.com/test&@chasesechrist"),
    "Check out: <a href=\"http://example.com/test\">http://example.com/test</a>&@<a class=\"tweet-url username\" href=\"http://twitter.com/chasesechrist\">chasesechrist</a>"
);
