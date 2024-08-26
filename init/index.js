const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>
{
    console.log("data base connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async()=>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"66cb8b20f171f1158315a381"})) // we are adding new property owenership demo
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();