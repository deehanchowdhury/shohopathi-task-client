
const {MongoClient} = require('mongodb');
const mongodb_objectid = require('mongodb').ObjectId;   

// async function main(){
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//      */
//      const uri = "mongodb+srv://deehan:deehan1997@cluster0.7jxxgwk.mongodb.net/?retryWrites=true&w=majority";
 

//     const client = new MongoClient(uri);
 
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
 
//         // Make the appropriate DB calls
//         //await  listDatabases(client);
//         // Creat Listing
//         // await createListing(client,
//         //     {
//         //         BookName: "Lovely Loft",
//         //         Author: "J. Peterson",
//         //         Genre: "Comedy"
//         //     }
//         // );
//         // Create multiple listing
//         // await createMultipleListings(client, [
//         //     {
//         //         BookName: "Harry Potter",
//         //         Author: "J. K. Rawling",
//         //         Genre: "Fantasy"
//         //     },
//         //     {
//         //         BookName: "A Comedy of Errors",
//         //         Author: "W. Shakespear",
//         //         Genre: "Comedy"
//         //     },
//         //     {
//         //         BookName: "Lovely Loft 2",
//         //         Author: "J. Peterson",
//         //         Genre: "Comedy"
//         //     }
//         // ]);

//         // Find in the listing

//         ///await findAllListingByName(client, "Lovely Loft 2");

//         // Find All Books

//         const results = await findAllBooks(client);
//         return results
 
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }

// main().catch(console.error);

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
 
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

async function createListing(client, newListing){
    const result = await client.db("Smart-Library").collection("Books").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    return new mongodb_objectid(result.insertedId)
}

async function deleteListing(client, idOfListing) {
    const result = await client.db("Smart-Library").collection("Books").deleteOne({ _id: new mongodb_objectid(idOfListing) });
    console.log(`${result.deletedCount} document(s) with id ${idOfListing}  was/were deleted.`);

}

async function updateListingbyID(client,idOfListing,updatedListing) {
    const result = await client.db("Smart-Library").collection("Books").replaceOne(
        { _id: new mongodb_objectid(idOfListing) },
        updatedListing
    );
    console.log(`${result.matchedCount} document(s) matched the query criteria with id: ${idOfListing}`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}
async function updateUserListingbyID(client,idOfListing,updatedListing) {
    const result = await client.db("Smart-Library").collection("users").replaceOne(
        { _id: new mongodb_objectid(idOfListing) },
        updatedListing
    );
    console.log(`${result.matchedCount} document(s) matched the query criteria with id: ${idOfListing}`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}
// async function createMultipleListings(client, newListings){
//     const result = await client.db("Smart-Library").collection("Books").insertMany(newListings);

//     console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
//     console.log(result.insertedIds);       
// }

// async function findOneListingByName(client, nameOfListing) {
//     const result = await client.db("Smart-Library").collection("Books").findOne({ BookName: nameOfListing });

//     if (result) {
//         console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
//         console.log(result);
//     } else {
//         console.log(`No listings found with the name '${nameOfListing}'`);
//     }
// }



// async function findAllListingByName(client, nameOfListing) {
//     const cursor = await client.db("Smart-Library").collection("Books").find({ BookName: nameOfListing });
//     const results = await cursor.toArray();
//     if (results.length > 0) {
//         console.log(`Found all listing in the collection with the name '${nameOfListing}':`);
//         results.forEach((result, i) => {
            
//             console.log();
//             console.log(`${i + 1}. BookName: ${result.BookName}`);
//             console.log(`   _id: ${result._id}`);
//             console.log(`   Author: ${result.Author}`);
//             console.log(`   Genre: ${result.Genre}`);
//         });
//     } else {
//         console.log(`No listings found with the name '${nameOfListing}'`);
//     }
// }

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

async function findAllBooks(client) {
    
    const cursor = await client.db("Smart-Library").collection("Books").find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log(`Found all Books in the collection `);
        // results.forEach((result, i) => {
            
        //     console.log();
        //     console.log(`${i + 1}. BookName: ${result.BookName}`);
        //     console.log(`   _id: ${result._id}`);
        //     console.log(`   Author: ${result.Author}`);
        //     console.log(`   Genre: ${result.Genre}`);
        // });
        return results
    } else {
        console.log(`No Books Found`);
    }
}

async function findAllUsers(client) {
    
    const cursor = await client.db("Smart-Library").collection("users").find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log(`Found all users in the collection `);
        // results.forEach((result, i) => {
            
        //     console.log();
        //     console.log(`${i + 1}. BookName: ${result.BookName}`);
        //     console.log(`   _id: ${result._id}`);
        //     console.log(`   Author: ${result.Author}`);
        //     console.log(`   Genre: ${result.Genre}`);
        // });
        return results
    } else {
        console.log(`No users Found`);
    }
}

async function createListingUsers(client, newListing){
    const result = await client.db("Smart-Library").collection("users").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    return new mongodb_objectid(result.insertedId)
}



module.exports = {findAllBooks,createListing,deleteListing,updateListingbyID,findAllUsers,createListingUsers,updateUserListingbyID};
