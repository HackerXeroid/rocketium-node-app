// There were too many duplicate items from where I was fetching the data so,
// I had to create this function.
function removeDuplicates(arr) {
  const set = new Set();
  const ans = arr.filter(entry => {
    if (set.has(entry.id)) return false;

    set.add(entry.id);
    return true;
  });

  return ans;
}

module.exports = { removeDuplicates };