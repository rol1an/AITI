const q = "初音未来";
fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-cn&tl=en&dt=t&q=' + encodeURIComponent(q))
  .then(res => res.json())
  .then(data => console.log(data[0][0][0]))
  .catch(console.error);
