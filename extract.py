import html.parser
import sys

class TextParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.in_skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ('style', 'script', 'head', 'meta', 'link'):
            self.in_skip = True

    def handle_endtag(self, tag):
        if tag in ('style', 'script', 'head', 'meta', 'link'):
            self.in_skip = False

    def handle_data(self, data):
        if not self.in_skip:
            cleaned = data.strip()
            if cleaned:
                self.text.append(cleaned)

with open('aslsalon.html', 'r', encoding='utf-16') as f:
    content = f.read()

parser = TextParser()
parser.feed(content)
for t in parser.text:
    print(t)
