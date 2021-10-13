export function getPaperName(content) {
  return content.formImage.Pages[0].Texts.filter((text) => {
    return text.R[0].TS[0] === 2 && text.R[0].TS[1] > 15;
  })
    .map((text) => {
      return decodeURIComponent(text.R[0].T);
    })
    .join(" ");
}
