var assert = require("assert");
var twittertext = require("../lib/twittertext");
var message;


// Extract mention at the begining of a message.
message = new twittertext.Message("@username reply");
assert.deepEqual(
    message.mentions,
    ["username"]
);


// Extract mention at the end of a message.
message = new twittertext.Message("mention @username");
assert.deepEqual(
    message.mentions,
    ["username"]
);


// Extract mention in the middle of a message.
message = new twittertext.Message("mention @username in the middle");
assert.deepEqual(
    message.mentions,
    ["username"]
);


// Extract mention of username with underscore.
message = new twittertext.Message("mention @user_name");
assert.deepEqual(
    message.mentions,
    ["user_name"]
);


// Extract mention of all numeric username.
message = new twittertext.Message("mention @12345");
assert.deepEqual(
    message.mentions,
    ["12345"]
);


// Extract mention or multiple usernames.
message = new twittertext.Message("mention @username1 @username2");
assert.deepEqual(
    message.mentions,
    ["username1", "username2"]
);


// Extract mention in the middle of a Japanese message.
message = new twittertext.Message("の@usernameに到着を待っている");
assert.deepEqual(
    message.mentions,
    ["username"]
);


// DO NOT extract username ending in @.
message = new twittertext.Message("Current Status: @_@ (cc: @username)");
assert.deepEqual(
    message.mentions,
    ["username"]
);


// Extract lone metion but not @user@user (too close to an email).
message = new twittertext.Message("@username email me @test@example.com");
assert.deepEqual(
    message.mentions,
    ["username"]
);


// Extract reply at the begining of a message.
message = new twittertext.Message("@username reply");
assert.deepEqual(
    message.replies,
    ["username"]
);


// Extract reply preceded by only a space.
message = new twittertext.Message(" @username reply");
assert.deepEqual(
    message.replies,
    ["username"]
);


// Extract reply preceded by only a full-width space (U+3000).
message = new twittertext.Message("　@username reply");
assert.deepEqual(
    message.replies,
    ["username"]
);


// DO NOT Extract reply when preceded by text.
message = new twittertext.Message("a @username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by ..
message = new twittertext.Message(".@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by /.
message = new twittertext.Message("/@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by _.
message = new twittertext.Message("_@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by -.
message = new twittertext.Message("-@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by +.
message = new twittertext.Message("+@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by #.
message = new twittertext.Message("#@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by !.
message = new twittertext.Message("!@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// DO NOT Extract reply when preceded by @.
message = new twittertext.Message("@@username mention, not a reply");
assert.deepEqual(
    message.replies,
    []
);


// Extract a lone URL.
message = new twittertext.Message("http://example.com");
assert.deepEqual(
    message.urls,
    ["http://example.com"]
);


// Extract valid URL: http://google.com.
message = new twittertext.Message("text http://google.com");
assert.deepEqual(
    message.urls,
    ["http://google.com"]
);


// Extract valid URL: http://foobar.com/#.
message = new twittertext.Message("text http://foobar.com/#");
assert.deepEqual(
    message.urls,
    ["http://foobar.com/#"]
);


// Extract valid URL: http://google.com/#foo.
message = new twittertext.Message("text http://google.com/#foo");
assert.deepEqual(
    message.urls,
    ["http://google.com/#foo"]
);


// Extract valid URL: http://google.com/#search?q=iphone%20-filter%3Alinks.
message = new twittertext.Message("text http://google.com/#search?q=iphone%20-filter%3Alinks");
assert.deepEqual(
    message.urls,
    ["http://google.com/#search?q=iphone%20-filter%3Alinks"]
);


// Extract valid URL: http://twitter.com/#search?q=iphone%20-filter%3Alinks.
message = new twittertext.Message("text http://twitter.com/#search?q=iphone%20-filter%3Alinks");
assert.deepEqual(
    message.urls,
    ["http://twitter.com/#search?q=iphone%20-filter%3Alinks"]
);


// Extract valid URL: http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html.
message = new twittertext.Message("text http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html");
assert.deepEqual(
    message.urls,
    ["http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html"]
);


// Extract valid URL: http://somehost.com:3000.
message = new twittertext.Message("text http://somehost.com:3000");
assert.deepEqual(
    message.urls,
    ["http://somehost.com:3000"]
);


// Extract valid URL: http://xo.com/~matthew+%-x.
message = new twittertext.Message("text http://xo.com/~matthew+%-x");
assert.deepEqual(
    message.urls,
    ["http://xo.com/~matthew+%-x"]
);


// Extract valid URL: http://xo.com/~matthew+%-,.;x.
message = new twittertext.Message("text http://xo.com/~matthew+%-,.;x");
assert.deepEqual(
    message.urls,
    ["http://xo.com/~matthew+%-,.;x"]
);


// Extract valid URL: http://xo.com/,.;x.
message = new twittertext.Message("text http://xo.com/,.;x");
assert.deepEqual(
    message.urls,
    ["http://xo.com/,.;x"]
);


// Extract valid URL: http://en.wikipedia.org/wiki/Primer_(film).
message = new twittertext.Message("text http://en.wikipedia.org/wiki/Primer_(film)");
assert.deepEqual(
    message.urls,
    ["http://en.wikipedia.org/wiki/Primer_(film)"]
);


// Extract valid URL: http://www.ams.org/bookstore-getitem/item=mbk-59.
message = new twittertext.Message("text http://www.ams.org/bookstore-getitem/item=mbk-59");
assert.deepEqual(
    message.urls,
    ["http://www.ams.org/bookstore-getitem/item=mbk-59"]
);


// Extract valid URL: http://✪df.ws/ejp.
message = new twittertext.Message("text http://✪df.ws/ejp");
assert.deepEqual(
    message.urls,
    ["http://✪df.ws/ejp"]
);


// Extract valid URL: http://chilp.it/?77e8fd.
message = new twittertext.Message("text http://chilp.it/?77e8fd");
assert.deepEqual(
    message.urls,
    ["http://chilp.it/?77e8fd"]
);


// Extract valid URL: http://x.com/oneletterdomain.
message = new twittertext.Message("text http://x.com/oneletterdomain");
assert.deepEqual(
    message.urls,
    ["http://x.com/oneletterdomain"]
);


// DO NOT extract invalid URL: http://-begin_dash_2314352345_dfasd.foo-cow_4352.com.
message = new twittertext.Message("text http://doman-dash_2314352345_dfasd.foo-cow_4352.com");
assert.deepEqual(
    message.urls,
    []
);


// DO NOT extract invalid URL: http://no-tld.
message = new twittertext.Message("text http://no-tld");
assert.deepEqual(
    message.urls,
    []
);


// DO NOT extract invalid URL: http://tld-too-short.x.
message = new twittertext.Message("text http://tld-too-short.x");
assert.deepEqual(
    message.urls,
    []
);

  
// Extract a very long hyphenated sub-domain URL (single letter hyphens).
message = new twittertext.Message("text http://word-and-a-number-8-ftw.domain.tld/");
assert.deepEqual(
    message.urls,
    ["http://word-and-a-number-8-ftw.domain.tld/"]
);

      
// Extract a hyphenated TLD (usually a typo).
message = new twittertext.Message("text http://domain.tld-that-you-should-have-put-a-space-after");
assert.deepEqual(
    message.urls,
    ["http://domain.tld"]
);


// Extract an all-alpha hashtag.
message = new twittertext.Message("a #hashtag here");
assert.deepEqual(
    message.hashtags,
    ["hashtag"]
);


// Extract a letter-then-number hashtag.
message = new twittertext.Message("this is #hashtag1");
assert.deepEqual(
    message.hashtags,
    ["hashtag1"]
);


// Extract a number-then-letter hashtag.
message = new twittertext.Message("#1hashtag is this");
assert.deepEqual(
    message.hashtags,
    ["1hashtag"]
);


// DO NOT Extract an all-numeric hashtag.
message = new twittertext.Message("On the #16 bus");
assert.deepEqual(
    message.hashtags,
    []
);


// Extract a hashtag containing ñ.
message = new twittertext.Message("I'll write more tests #mañana");
assert.deepEqual(
    message.hashtags,
    ["mañana"]
);


// Extract a hashtag containing é.
message = new twittertext.Message("Working remotely #café");
assert.deepEqual(
    message.hashtags,
    ["café"]
);


// Extract a hashtag containing ü.
message = new twittertext.Message("Getting my Oktoberfest on #münchen");
assert.deepEqual(
    message.hashtags,
    ["münchen"]
);


// DO NOT Extract a hashtag containing Japanese.
message = new twittertext.Message("this is not valid: # 会議中 ハッシュ");
assert.deepEqual(
    message.hashtags,
    []
);
