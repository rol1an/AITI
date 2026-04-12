import json
import sys
from deep_translator import GoogleTranslator
import urllib.request, urllib.parse

def to_tw(text_list):
    res = []
    for chunk in text_list:
        if not chunk.strip():
            res.append(chunk)
            continue
        try:
            url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-cn&tl=zh-tw&dt=t&q=" + urllib.parse.quote(chunk)
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            rx = urllib.request.urlopen(req).read().decode('utf-8')
            data = json.loads(rx)
            res.append("".join([d[0] for d in data[0]]))
        except:
            res.append(chunk)
    return res

def batch_translate(texts, tl):
    if tl == 'zh-TW': return to_tw(texts)
    gt = GoogleTranslator(source='zh-CN', target=tl)
    # create batches of < 4000 chars
    res = []
    bz = 20
    for i in range(0, len(texts), bz):
        chunk = texts[i:i+bz]
        joined = "\n====\n".join(chunk)
        try:
            translated = gt.translate(joined)
            t_chunk = translated.split("\n====\n")
            if len(t_chunk) != len(chunk):
                # Fallback one by one
                for c in chunk:
                    res.append(gt.translate(c) if c.strip() else c)
            else:
                res.extend(t_chunk)
        except Exception as e:
            print("Err", e)
            for c in chunk:
                res.append(c)
    return res

def main():
    with open('source_zh.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    paths = []
    texts = []
    def extract(node, path):
        if isinstance(node, dict):
            for k, v in node.items():
                extract(v, path + [k])
        elif isinstance(node, list):
            for i, v in enumerate(node):
                extract(v, path + [i])
        elif isinstance(node, str):
            paths.append(path)
            texts.append(node)
            
    extract(data, [])
    print(f"Extracted {len(texts)} strings.")
    
    for tl, fname in [('en', 'source_en.json'), ('ja', 'source_ja.json'), ('zh-TW', 'source_tw.json')]:
        print("Translating to", tl)
        t_texts = batch_translate(texts, tl)
        
        # reconstruct
        import copy
        new_data = copy.deepcopy(data)
        for path, t_str in zip(paths, t_texts):
            # walk
            curr = new_data
            for p in path[:-1]:
                curr = curr[p]
            curr[path[-1]] = t_str
            
        with open(fname, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
