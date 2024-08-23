
const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required:true
        
    },
    description:{
        type:String
    },
    image:{

        type:String,
        default: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
        
        set: (v)=>v==="" ? "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D":v
    },
    price:{
        type:Number
        
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>             // this is  post midware to delet the reviews
{
    if(listing)
    {
        await review.deleteMany({_id: {$in: listing.reviews}}); 
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
