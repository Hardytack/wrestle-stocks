async function asyncVerify(arr, cb) {
  let check = true;
  for (let i = 0; i < arr.length; i++) {
    let result = await cb(arr[i]);

    if (!result) check = false;
  }
  return check;
}

async function verifyWrestlers(name) {
  try {
    let regexVal = `^${name}$`;
    let regexName = new RegExp(regexVal, "i");
    const wrestler = await Wrestler.findOne({
      $or: [
        { name: { $regex: new RegExp(regexName, "i") } },
        { altNames: { $regex: new RegExp(regexName, "i") } },
      ],
    });
    if (!wrestler) {
      console.log(name);
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = { asyncVerify, verifyWrestlers };
