const fs = require("fs").promises;
const path = require("path");

/*
  You might think that my don't I save the data once for getting all users.
  But I tried to do things like database as, in case of database you fetch the data everytime.
*/
async function getUsers(req, res) {
  try {
    const fileLocation = path.join(__dirname, "..", "data", "users.js");
    const data = await fs.readFile(fileLocation);
    const parsedData = JSON.parse(data);
    
    const validQueries = ["sort", "name", "language", "version"];
    const queries = req.query;

    for (const query in queries) {
      console.log(query);
      if (!validQueries.includes(query.toLowerCase()))
        throw new Error("Invalid query specified.");
    }

    // FILTERING (name, language, version)
    // again, it doesn't make sense that user will enter such a big description for filtering and id is rather unique so, it comes only once. So, again so sense.
    
    let newData = parsedData;
    if (queries.name) {
      newData = newData.filter(user => user.name.toLowerCase() === queries.name.toLowerCase());
    }

    if (queries.language) {
      newData = newData.filter(user => user.language.toLowerCase() === queries.language.toLowerCase());
    }

    if (queries.version) {
      newData = newData.filter(user => user.version === +queries.version);
    }
    
    // SORTING (NAME, LANGUAGE, VERSION)
    // as it is pretty useless to sort by bio and id (not that common).
    const validSortOrders = ["asc", "desc"];
    
    if (queries.sort) {
      let values = queries.sort;
      values = values.replace(/,[ ]*/g, ',').split(',');

      // If one of the values were missing
      if (values.length <= 1)
        throw new Error("Either sort value or sort order is missing.");

      // If invalid sort order were specified and setting the valid sort order
      const sortOrder = values[values.length - 1];
      if (!validSortOrders.includes(sortOrder))
        throw new Error("Invalid sort order specified");

      // Removing the sort order from values to get only sort by fields
      values.splice(values.length - 1, 1);
      
      // Sorting on the basis of fields
      newData.sort((user1, user2) => {
        for (const currField of values) {
          let a = user1[currField];
          let b = user2[currField];

          if (typeof a === "string") {
            a = a.toLowerCase();
            b = b.toLowerCase();
          }

          if (a < b) 
            return -1 * (sortOrder === "asc" ? 1 : -1);
          if (a > b) 
            return 1 * (sortOrder === "asc" ? 1 : -1);
        }

        return 0;
      });
    }

    res.send({
      status: 200,
      message: "Data fetched successfully",
      data: newData
    });
  } catch (err) {
    res.json({
      status: 400,
      message: err.message
    });
  }
}

module.exports = { getUsers };