```js
const nestedData = (data) => {
  const buildTree = (items, parentId = null) => {
    const result = [];
    const children = _.filter(items, { parent: parentId });

    for (const child of children) {
      const { ...rest } = child; // Omit the "_id" and "parent" properties

      const subRows = buildTree(items, rest._id);
      if (subRows.length > 0) {
        rest.subRows = subRows.reverse();
      }

      result.push(rest);
    }

    return result;
  };

  // const rootItems = _.filter(data, { parent: null });

  return buildTree(data, null);
};
```
