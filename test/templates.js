var assert = require("assert");
var twittertext = require("../lib/twittertext");
var message;


// Change mention template
twittertext.template.mention = "$<a class=\"user\" href=\"/user/%(url)s\">%(title)s</a>";
message = new twittertext.Message("text @fooman");
assert.equal(
    message.html,
    "text $<a class=\"user\" href=\"/user/fooman\">fooman</a>"
);


// Change mention template on message object
message = new twittertext.Message("text @fooman");
message.template.mention = "$<a class=\"person\" href=\"/user/%(url)s\">%(title)s</a>";
assert.equal(
    message.html,
    "text $<a class=\"person\" href=\"/user/fooman\">fooman</a>"
);


// Change list template
twittertext.template.list = "%(prefix)s<a class=\"list\" href=\"/list/%(url)s%(name)s\">%(title)s%(name)s</a>";
message = new twittertext.Message("text @user/and_his_list");
assert.equal(
    message.html,
    "text @<a class=\"list\" href=\"/list/user/and_his_list\">user/and_his_list</a>"
);


// Change list template on message object
message = new twittertext.Message("text @user/and_his_list");
message.template.list = "%(prefix)s<a class=\"userlist\" href=\"/list/%(url)s%(name)s\">%(title)s%(name)s</a>";
assert.equal(
    message.html,
    "text @<a class=\"userlist\" href=\"/list/user/and_his_list\">user/and_his_list</a>"
);


// Change hashtag template
twittertext.template.hashtag = "<a href=\"/messages/tagged?q=%(url)s\" class=\"tag\">%(name)s</a>";
message = new twittertext.Message("text #hashtag");
assert.equal(
    message.html,
    "text <a href=\"/messages/tagged?q=%23hashtag\" class=\"tag\">#hashtag</a>"
);


// Change hashtag template on message object
message = new twittertext.Message("text #hashtag");
message.template.hashtag = "<a href=\"/messages/tagged?q=%(url)s\" class=\"tagged\">%(name)s</a>";
assert.equal(
    message.html,
    "text <a href=\"/messages/tagged?q=%23hashtag\" class=\"tagged\">#hashtag</a>"
);


// Change url template
twittertext.template.url = "<a class=\"link\" href=\"%(url)s\">%(title)s</a>";
message = new twittertext.Message("text http://example.com more text");
assert.equal(
    message.html,
    "text <a class=\"link\" href=\"http://example.com\">http://example.com</a> more text"
);


// Change url template on message object
message = new twittertext.Message("text http://example.com more text");
message.template.url = "<a class=\"foo\" href=\"%(url)s\">%(title)s</a>";
assert.equal(
    message.html,
    "text <a class=\"foo\" href=\"http://example.com\">http://example.com</a> more text"
);


// Allow overriding the common types
twittertext.template.whitespace = "&nbsp;";
twittertext.template.text = "<span>%(title)s</span>";
message = new twittertext.Message("text and more text");
assert.equal(
    message.html,
    "<span>text</span>&nbsp;<span>and</span>&nbsp;<span>more</span>&nbsp;<span>text</span>"
);
