const SplitParagraph = ({ text }) => {
  const middle = Math.floor(text.length / 2);
  const splitIndex = text.lastIndexOf(".", middle);

  const adjustedSplitIndex =
    splitIndex !== -1 ? splitIndex : text.lastIndexOf(" ", middle);

  const firstHalf = text.slice(0, adjustedSplitIndex + 1);
  const secondHalf = text.slice(adjustedSplitIndex + 1).trim();

  return (
    <div style={{ lineHeight: "1.5" }}>
      <p>{firstHalf}</p>
      <p>{secondHalf}</p>
    </div>
  );
};

export default SplitParagraph;
