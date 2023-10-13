const { Category } = require("../../models");

module.exports.getCategories = async (userId) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          owner: userId,
        },
      },
      {
        $facet: {
          incomes: [
            {
              $group: {
                _id: "$type",
                categoriesList: {
                  $push: { id: "$_id", name: "$name", type: "$type" },
                },
              },
            },
            {
              $match: {
                _id: "incomes",
              },
            },
          ],
          expenses: [
            {
              $group: {
                _id: "$type",
                categoriesList: {
                  $push: { id: "$_id", name: "$name", type: "$type" },
                },
              },
            },
            {
              $match: {
                _id: "expenses",
              },
            },
          ],
        },
      },
    ]);

    return Object.entries(categories[0]).reduce((acc, [key, data]) => {
      acc[key] = data[0].categoriesList;
      return acc;
    }, {});
  } catch (error) {
    throw error;
  }
};
