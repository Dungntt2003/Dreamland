const removeDuplicateFromDescription = (description) => {
  if (!description) return [];

  const items = description
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter((item) => item);

  const processedItems = [];

  items.forEach((item) => {
    const words = item.split(" ");
    const halfLength = Math.floor(words.length / 2);

    const firstHalf = words.slice(0, halfLength).join(" ");
    const secondHalf = words.slice(halfLength).join(" ");

    const cleanedItem = firstHalf === secondHalf ? firstHalf : item;

    const normalizedItem = cleanedItem
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const isDuplicate = processedItems.some((existingItem) => {
      const normalizedExisting = existingItem
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      return normalizedExisting === normalizedItem;
    });

    if (!isDuplicate && cleanedItem) {
      processedItems.push(cleanedItem);
    }
  });

  return processedItems;
};

export default removeDuplicateFromDescription;
