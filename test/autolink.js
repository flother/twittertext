var assert = require("assert");
var twittertext = require("../lib/twittertext");
var message;


// Autolink trailing username.
message = new twittertext.Message("text @username");
assert.equal(
    message.html,
    "text @<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// Autolink username at the beginning.
message = new twittertext.Message("@username text");
assert.equal(
    message.html,
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a> text"
);


// DO NOT Autolink username preceded by a letter.
message = new twittertext.Message("meet@the beach");
assert.equal(
    message.html,
    "meet@the beach"
);


// Autolink username preceded by puctuation.
message = new twittertext.Message("great.@username");
assert.equal(
    message.html,
    "great.@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// Autolink username followed by puctuation.
message = new twittertext.Message("@username&^$%^");
assert.equal(
    message.html,
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>&^$%^"
);


// Autolink username followed by Japanese.
message = new twittertext.Message("@usernameの");
assert.equal(
    message.html,
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>の"
);


// Autolink username preceded by Japanese.
message = new twittertext.Message("あ@username");
assert.equal(
    message.html,
    "あ@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// Autolink username surrounded by Japanese.
message = new twittertext.Message("あ@usernameの");
assert.equal(
    message.html,
    "あ@<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>の"
);


// Autolink username with full-width at sign (U+FF20).
message = new twittertext.Message("＠username");
assert.equal(
    message.html,
    "＠<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>"
);


// DO NOT Autolink username over 20 characters.
message = new twittertext.Message("@username9012345678901");
assert.equal(
    message.html,
    "@<a class=\"tweet-url username\" href=\"http://twitter.com/username901234567890\">username901234567890</a>1"
);


// Autolink list preceded by a space.
message = new twittertext.Message("text @username/list");
assert.equal(
    message.html,
    "text @<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>"
);


// DO NOT Autolink list when space follows slash.
message = new twittertext.Message("text @username/ list");
assert.equal(
    message.html,
    "text @<a class=\"tweet-url username\" href=\"http://twitter.com/username\">username</a>/ list"
);


// DO NOT Autolink list with empty username.
message = new twittertext.Message("text @/list");
assert.equal(
    message.html,
    "text @/list"
);


// Autolink list at the beginning.
message = new twittertext.Message("@username/list");
assert.equal(
    message.html,
    "@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>"
);


// DO NOT Autolink list preceded by letter.
message = new twittertext.Message("meet@the/beach");
assert.equal(
    message.html,
    "meet@the/beach"
);


// Autolink list preceded by puctuation.
message = new twittertext.Message("great.@username/list");
assert.equal(
    message.html,
    "great.@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>"
);


// Autolink list followed by puctuation.
message = new twittertext.Message("@username/list&^$%^");
assert.equal(
    message.html,
    "@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list\">username/list</a>&^$%^"
);


// Autolink list name over 80 characters (truncated to 80).
message = new twittertext.Message("@username/list5678901234567890123456789012345678901234567890123456789012345678901234567890A");
assert.equal(
    message.html,
    "@<a class=\"tweet-url list-slug\" href=\"http://twitter.com/username/list5678901234567890123456789012345678901234567890123456789012345678901234567890\">username/list5678901234567890123456789012345678901234567890123456789012345678901234567890</a>A"
);


// Autolink trailing hashtag.
message = new twittertext.Message("text #hashtag");
assert.equal(
    message.html,
    "text <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>"
);


// Autolink alphanumeric hashtag (letter-number-letter).
message = new twittertext.Message("text #hash0tag");
assert.equal(
    message.html,
    "text <a href=\"http://twitter.com/search?q=%23hash0tag\" title=\"#hash0tag\" class=\"tweet-url hashtag\">#hash0tag</a>"
);


// Autolink alphanumeric hashtag (number-letter).
message = new twittertext.Message("text #1tag");
assert.equal(
    message.html,
    "text <a href=\"http://twitter.com/search?q=%231tag\" title=\"#1tag\" class=\"tweet-url hashtag\">#1tag</a>"
);


// Autolink hashtag with underscore.
message = new twittertext.Message("text #hash_tag");
assert.equal(
    message.html,
    "text <a href=\"http://twitter.com/search?q=%23hash_tag\" title=\"#hash_tag\" class=\"tweet-url hashtag\">#hash_tag</a>"
);


// DO NOT Autolink all-numeric hashtags.
message = new twittertext.Message("text #1234");
assert.equal(
    message.html,
    "text #1234"
);


// DO NOT Autolink hashtag preceded by a letter.
message = new twittertext.Message("text#hashtag");
assert.equal(
    message.html,
    "text#hashtag"
);


// Autolink multiple hashtags.
message = new twittertext.Message("text #hashtag1 #hashtag2");
assert.equal(
    message.html,
    "text <a href=\"http://twitter.com/search?q=%23hashtag1\" title=\"#hashtag1\" class=\"tweet-url hashtag\">#hashtag1</a> <a href=\"http://twitter.com/search?q=%23hashtag2\" title=\"#hashtag2\" class=\"tweet-url hashtag\">#hashtag2</a>"
);


// Autolink hashtag preceded by a period.
message = new twittertext.Message("text.#hashtag");
assert.equal(
    message.html,
    "text.<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>"
);


// DO NOT Autolink hashtag preceded by &.
message = new twittertext.Message("&#nbsp;");
assert.equal(
    message.html,
    "&#nbsp;"
);


// Autolink hashtag followed by ! (! not included).
message = new twittertext.Message("text #hashtag!");
assert.equal(
    message.html,
    "text <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>!"
);


// Autolink hashtag followed by Japanese.
message = new twittertext.Message("text #hashtagの");
assert.equal(
    message.html,
    "text <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>の"
);


// Autolink hashtag preceded by full-width space (U+3000).
message = new twittertext.Message("text　#hashtag");
assert.equal(
    message.html,
    "text　<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>"
);


// Autolink hashtag followed by full-width space (U+3000).
message = new twittertext.Message("#hashtag　text");
assert.equal(
    message.html,
    "<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>　text"
);


// Autolink hashtag with full-width hash (U+FF03).
message = new twittertext.Message("＃hashtag");
assert.equal(
    message.html,
    "<a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">＃hashtag</a>"
);


// DO NOT Autolink hashtag with accented character at the start.
message = new twittertext.Message("#éhashtag");
assert.equal(
    message.html,
    "#éhashtag"
);


// Autolink hashtag with accented character at the end.
message = new twittertext.Message("#hashtagé");
assert.equal(
    message.html,
    "<a href=\"http://twitter.com/search?q=%23hashtag%C3%A9\" title=\"#hashtagé\" class=\"tweet-url hashtag\">#hashtagé</a>"
);


// Autolink hashtag with accented character in the middle.
message = new twittertext.Message("#hashétag");
assert.equal(
    message.html,
    "<a href=\"http://twitter.com/search?q=%23hash%C3%A9tag\" title=\"#hashétag\" class=\"tweet-url hashtag\">#hashétag</a>"
);


// Autolink trailing url.
message = new twittertext.Message("text http://example.com");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>"
);


// Autolink url in mid-text.
message = new twittertext.Message("text http://example.com more text");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a> more text"
);


// -- Test is currently disabled as the string gets malformed when it is passed to
// -- twittertext.Message. Is node messing it up?
// Autolink url in Japanese text.
/*
message = new twittertext.Message("いまなにしてるhttp://example.comいまなにしてる");
assert.equal(
    message.html,
    "いまなにしてる<a href=\"http://example.com\">http://example.com</a>いまなにしてる"
);
*/

// Autolink url surrounded by parentheses does not capture them.
message = new twittertext.Message("text (http://example.com)");
assert.equal(
    message.html,
    "text (<a href=\"http://example.com\">http://example.com</a>)"
);


// Autolink url with path surrounded by parentheses does not capture them.
message = new twittertext.Message("text (http://example.com/test)");
assert.equal(
    message.html,
    "text (<a href=\"http://example.com/test\">http://example.com/test</a>)"
);


// Autolink url with embedded parentheses.
message = new twittertext.Message("text http://msdn.com/S(deadbeef)/page.htm");
assert.equal(
    message.html,
    "text <a href=\"http://msdn.com/S(deadbeef)/page.htm\">http://msdn.com/S(deadbeef)/page.htm</a>"
);


// Autolink url should NOT capture unbalanced parentheses.
message = new twittertext.Message("Parenthetically bad http://example.com/i_has_a_) thing");
assert.equal(
    message.html,
    "Parenthetically bad <a href=\"http://example.com/i_has_a_\">http://example.com/i_has_a_</a>) thing"
);


// Autolink url containing unicode characters.
message = new twittertext.Message("I enjoy Macintosh Brand computers: http://✪df.ws/ejp");
assert.equal(
    message.html,
    "I enjoy Macintosh Brand computers: <a href=\"http://✪df.ws/ejp\">http://✪df.ws/ejp</a>"
);


// Autolink url with .co. under TLD.
message = new twittertext.Message("test http://www.example.co.jp");
assert.equal(
    message.html,
    "test <a href=\"http://www.example.co.jp\">http://www.example.co.jp</a>"
);


// DO NOT Autolink url containing ! character in the domain.
message = new twittertext.Message("badly formatted http://foo!bar.com");
assert.equal(
    message.html,
    "badly formatted http://foo!bar.com"
);


// DO NOT Autolink url containing _ character in the domain.
message = new twittertext.Message("badly formatted http://foo_bar.com");
assert.equal(
    message.html,
    "badly formatted http://foo_bar.com"
);


// Autolink url preceded by :.
message = new twittertext.Message("text:http://example.com");
assert.equal(
    message.html,
    "text:<a href=\"http://example.com\">http://example.com</a>"
);


// Autolink url followed by ? (without it).
message = new twittertext.Message("text http://example.com?");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>?"
);


// Autolink url followed by ! (without it).
message = new twittertext.Message("text http://example.com!");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>!"
);


// Autolink url followed by , (without it).
message = new twittertext.Message("text http://example.com,");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>,"
);


// Autolink url followed by . (without it).
message = new twittertext.Message("text http://example.com.");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>."
);


// Autolink url followed by : (without it).
message = new twittertext.Message("text http://example.com:");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>:"
);


// Autolink url followed by ; (without it).
message = new twittertext.Message("text http://example.com;");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>;"
);


// Autolink url followed by ] (without it).
message = new twittertext.Message("text http://example.com]");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>]"
);


// Autolink url followed by ) (without it).
message = new twittertext.Message("text http://example.com)");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>)"
);


// Autolink url followed by } (without it).
message = new twittertext.Message("text http://example.com}");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>}"
);


// Autolink url followed by = (without it).
message = new twittertext.Message("text http://example.com=");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>="
);


// Autolink url followed by ' (without it).
message = new twittertext.Message("text http://example.com'");
assert.equal(
    message.html,
    "text <a href=\"http://example.com\">http://example.com</a>'"
);


// DO NOT Autolink url preceded by /.
message = new twittertext.Message("text /http://example.com");
assert.equal(
    message.html,
    "text /http://example.com"
);


// DO NOT Autolink url preceded by !.
message = new twittertext.Message("text !http://example.com");
assert.equal(
    message.html,
    "text !http://example.com"
);


// DO NOT Autolink url preceded by =.
message = new twittertext.Message("text =http://example.com");
assert.equal(
    message.html,
    "text =http://example.com"
);


// Autolink url embedded in link tag.
message = new twittertext.Message("<link rel='true'>http://example.com</link>");
assert.equal(
    message.html,
    "<link rel='true'><a href=\"http://example.com\">http://example.com</a></link>"
);


// Autolink multiple urls.
message = new twittertext.Message("http://example.com https://sslexample.com http://sub.example.com");
assert.equal(
    message.html,
    "<a href=\"http://example.com\">http://example.com</a> <a href=\"https://sslexample.com\">https://sslexample.com</a> <a href=\"http://sub.example.com\">http://sub.example.com</a>"
);


// Autolink url with long TLD.
message = new twittertext.Message("http://example.mobi/path");
assert.equal(
    message.html,
    "<a href=\"http://example.mobi/path\">http://example.mobi/path</a>"
);


// Autolink url without protocol (with www).
message = new twittertext.Message("www.example.com");
assert.equal(
    message.html,
    "<a href=\"http://www.example.com\">www.example.com</a>"
);


// Autolink url without protocol (with WWW).
message = new twittertext.Message("WWW.EXAMPLE.COM");
assert.equal(
    message.html,
    "<a href=\"http://WWW.EXAMPLE.COM\">WWW.EXAMPLE.COM</a>"
);


// Multiple URLs with different protocols.
message = new twittertext.Message("http://foo.com AND https://bar.com AND www.foobar.com");
assert.equal(
    message.html,
    "<a href=\"http://foo.com\">http://foo.com</a> AND <a href=\"https://bar.com\">https://bar.com</a> AND <a href=\"http://www.foobar.com\">www.foobar.com</a>"
);


// Autolink raw domain followed by domain.
message = new twittertext.Message("See http://example.com example.com");
assert.equal(
    message.html,
    "See <a href=\"http://example.com\">http://example.com</a> example.com"
);


// Autolink url that includes @-sign and numeric dir under it.
message = new twittertext.Message("http://www.flickr.com/photos/29674651@N00/4382024406");
assert.equal(
    message.html,
    "<a href=\"http://www.flickr.com/photos/29674651@N00/4382024406\">http://www.flickr.com/photos/29674651@N00/4382024406</a>"
);


// Autolink url that includes @-sign and non-numeric dir under it.
message = new twittertext.Message("http://www.flickr.com/photos/29674651@N00/foobar");
assert.equal(
    message.html,
    "<a href=\"http://www.flickr.com/photos/29674651@N00/foobar\">http://www.flickr.com/photos/29674651@N00/foobar</a>"
);


// Autolink URL with only a domain followed by a period doesn't swallow the period..
message = new twittertext.Message("I think it's proper to end sentences with a period http://tell.me. Even when they contain a URL.");
assert.equal(
    message.html,
    "I think it's proper to end sentences with a period <a href=\"http://tell.me\">http://tell.me</a>. Even when they contain a URL."
);


// Autolink URL with a path followed by a period doesn't swallow the period..
message = new twittertext.Message("I think it's proper to end sentences with a period http://tell.me/why. Even when they contain a URL.");
assert.equal(
    message.html,
    "I think it's proper to end sentences with a period <a href=\"http://tell.me/why\">http://tell.me/why</a>. Even when they contain a URL."
);


// Autolink URL with a query followed by a period doesn't swallow the period..
message = new twittertext.Message("I think it's proper to end sentences with a period http://tell.me/why?=because.i.want.it. Even when they contain a URL.");
assert.equal(
    message.html,
    "I think it's proper to end sentences with a period <a href=\"http://tell.me/why?=because.i.want.it\">http://tell.me/why?=because.i.want.it</a>. Even when they contain a URL."
);


// Autolink URL with a hyphen in the domain name.
message = new twittertext.Message("Czech out sweet deals at http://mrs.domain-dash.biz ok?");
assert.equal(
    message.html,
    "Czech out sweet deals at <a href=\"http://mrs.domain-dash.biz\">http://mrs.domain-dash.biz</a> ok?"
);


// Autolink URL should NOT autolink www...foo.
message = new twittertext.Message("Is www...foo a valid URL?");
assert.equal(
    message.html,
    "Is www...foo a valid URL?"
);


// Autolink URL should NOT autolink www.-foo.com.
message = new twittertext.Message("Is www.-foo.com a valid URL?");
assert.equal(
    message.html,
    "Is www.-foo.com a valid URL?"
);


// Autolink URL should autolink a domain with a valid dash.
message = new twittertext.Message("Is www.foo-bar.com a valid URL?");
assert.equal(
    message.html,
    "Is <a href=\"http://www.foo-bar.com\">www.foo-bar.com</a> a valid URL?"
);


// Autolink URL should link search urls (with &lang=, not &lang;).
message = new twittertext.Message("Check out http://search.twitter.com/search?q=avro&lang=en");
assert.equal(
    message.html,
    "Check out <a href=\"http://search.twitter.com/search?q=avro&lang=en\">http://search.twitter.com/search?q=avro&lang=en</a>"
);


// Autolink all does not break on URL with @.
message = new twittertext.Message("http://www.flickr.com/photos/29674651@N00/4382024406 if you know what's good for you.");
assert.equal(
    message.html,
    "<a href=\"http://www.flickr.com/photos/29674651@N00/4382024406\">http://www.flickr.com/photos/29674651@N00/4382024406</a> if you know what's good for you."
);


// Autolink all does not allow & without ?.
message = new twittertext.Message("Check out: http://example.com/test&@chasesechrist");
assert.equal(
    message.html,
    "Check out: <a href=\"http://example.com/test\">http://example.com/test</a>&@<a class=\"tweet-url username\" href=\"http://twitter.com/chasesechrist\">chasesechrist</a>"
);
