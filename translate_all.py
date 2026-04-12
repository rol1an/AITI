import json
from deep_translator import GoogleTranslator

def to_tw(text):
    try:
        import urllib.request, urllib.parse
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-cn&tl=zh-tw&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req).read().decode('utf-8')
        data = json.loads(res)
        return "".join([d[0] for d in data[0]])
    except:
        return text

with open('source_zh.json', 'r', encoding='utf-8') as f:
    zh_data = json.load(f)

def traverse_translate(data, tl):
    if tl == 'zh-TW':
        translator = None
    else:
        translator = GoogleTranslator(source='zh-CN', target=tl)
        
    def _t(c):
        if isinstance(c, dict):
            return {k: _t(v) for k, v in c.items()}
        elif isinstance(c, list):
            return [_t(x) for x in c]
        elif isinstance(c, str):
            if not c.strip(): return c
            if tl == 'zh-TW':
                return to_tw(c)
            else:
                try:
                    return translator.translate(c)
                except Exception as e:
                    print('error trans', e)
                    return c
        return c
    return _t(zh_data)

print("Translating EN...")
with open('source_en.json', 'w', encoding='utf-8') as f:
    json.dump(traverse_translate(zh_data, 'en'), f, ensure_ascii=False, indent=2)

print("Translating JA...")
with open('source_ja.json', 'w', encoding='utf-8') as f:
    json.dump(traverse_translate(zh_data, 'ja'), f, ensure_ascii=False, indent=2)

print("Translating TW...")
with open('source_tw.json', 'w', encoding='utf-8') as f:
    json.dump(traverse_translate(zh_data, 'zh-TW'), f, ensure_ascii=False, indent=2)

print("Done")
