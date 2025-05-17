function splitTextIntoParagraphs(text, sentencesPerParagraph = 5) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const paragraphs = [];

  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    const chunk = sentences
      .slice(i, i + sentencesPerParagraph)
      .join(" ")
      .trim();
    paragraphs.push(chunk);
  }

  return paragraphs;
}

export default splitTextIntoParagraphs;
