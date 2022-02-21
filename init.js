// for the default version
import algoliasearch from 'algoliasearch';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { request, gql } from 'graphql-request';

dotenv.config();

const endpoint = process.env.STRAPI_ENDPOINT;

// Get your Algolia Application ID and (admin) API key from the dashboard: https://www.algolia.com/account/api-keys
// and choose a name for your index. Add these environment variables to a `.env` file:
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

// Start the API client
// https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

// Create an index (or connect to it, if an index with the name `ALGOLIA_INDEX_NAME` already exists)
// https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/#initialize-an-index
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const fetchVetementsFromDatabase = async () => {
    let queryVetement = gql`query {
        vetements
        {
            _id
            sku
            UrlImage1
            UrlImage2
            UrlImage3
            UrlImage4
            UrlImage5
            UrlImage6
            UrlImage7
            UrlImage8
            Brand
            Name
            BasePrice
            NetPrice
            advice
            size
            marque
            Category
            NumMarque
            NumArticle
            Couleur
            Fermeture
            conseilTaille
        }
    }`;

    const records = await request(endpoint, queryVetement);

    let objectAlgoliaTab = []
    for(let record of records.vetements) {
        let objectAlgolia = {
            objectID : record._id,
            sku: record.sku,
            UrlImage1: record.UrlImage1,
            UrlImage2: record.UrlImage2,
            UrlImage3: record.UrlImage3,
            UrlImage4: record.UrlImage4,
            UrlImage5: record.UrlImage5,
            UrlImage6: record.UrlImage6,
            UrlImage7: record.UrlImage7,
            UrlImage8: record.UrlImage8,
            Brand: record.Brand,
            Name: record.Name,
            BasePrice: record.BasePrice,
            NetPrice: record.NetPrice,
            advice: record.advice,
            size: record.size,
            marque: record.marque,
            Category: record.Category,
            NumMarque: record.NumMarque,
            NumArticle: record.NumArticle,
            Couleur: record.Couleur,
            Fermeture: record.Fermeture,
            conseilTaille: record.conseilTaille
        }
        objectAlgoliaTab.push(objectAlgolia);
    }
    return objectAlgoliaTab;
}

const fetchChaussuresFromDatabase = async () => {
    let queryChaussure = gql`query {
        chaussures
        {
            _id
            sku
            UrlImage1
            UrlImage2
            UrlImage3
            UrlImage4
            UrlImage5
            UrlImage6
            UrlImage7
            UrlImage8
            Brand
            Name
            BasePrice
            NetPrice
            advice
            size
            marque
            Category
            NumMarque
            NumArticle
            Couleur
            Fermeture
            DoublureInterieur
            hauteurTalon
            type
            conseilTaille
        }
    }`;

    const records = await request(endpoint, queryChaussure);

    let objectAlgoliaTab = [];
    for(let record of records.chaussures) {
        let objectAlgolia = {
            objectID : record._id,
            sku: record.sku,
            UrlImage1: record.UrlImage1,
            UrlImage2: record.UrlImage2,
            UrlImage3: record.UrlImage3,
            UrlImage4: record.UrlImage4,
            UrlImage5: record.UrlImage5,
            UrlImage6: record.UrlImage6,
            UrlImage7: record.UrlImage7,
            UrlImage8: record.UrlImage8,
            Brand: record.Brand,
            Name: record.Name,
            BasePrice: record.BasePrice,
            NetPrice: record.NetPrice,
            advice: record.advice,
            size: record.size,
            marque: record.marque,
            Category: record.Category,
            NumMarque: record.NumMarque,
            NumArticle: record.NumArticle,
            Couleur: record.Couleur,
            Fermeture: record.Fermeture,
            DoublureInterieur: record.DoublureInterieur,
            hauteurTalon: record.hauteurTalon,
            type: record.type,
            conseilTaille: record.conseilTaille
        }
        objectAlgoliaTab.push(objectAlgolia);
    }
    return objectAlgoliaTab;
}

fetchChaussuresFromDatabase()
.then(objectAlgoliaTab => {
    index
        .saveObjects(objectAlgoliaTab, { autoGenerateObjectIDIfNotExist: true })
        .wait()
        .then((response) => {
            console.log(response);
            // Search the index for "Fo"
            // https://www.algolia.com/doc/api-reference/api-methods/search/
            index.search("012105").then((objects) => console.log(objects)).catch();
        })
    }
        )
fetchVetementsFromDatabase()
    .then(objectAlgoliaTab => {
            index
                .saveObjects(objectAlgoliaTab, { autoGenerateObjectIDIfNotExist: true })
                .wait()
                .then((response) => {
                    console.log(response);
                    // Search the index for "Fo"
                    // https://www.algolia.com/doc/api-reference/api-methods/search/
                    index.search("013477").then((objects) => console.log(objects)).catch();
                })
        }
    )
        .catch(e => console.log(`error: ${e}`))
