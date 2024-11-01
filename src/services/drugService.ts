import axios from 'axios';
import { Drug, DrugReaction } from '../models/Drug';
import { OpenFDABaseResponse } from '../models/serviceModels/OpenFDABaseResponse';
import { OpenFDACountResponse } from '../models/serviceModels/OpenFDACountResponse';
import NodeCache from 'node-cache';

// Cache with a TTL (Time to Live) of 60 minutes (3600 seconds)
// Cache with a TTL (Time to Live) of 24 hours  (86400 seconds)
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 120 });

function getPaginationParams(currentPage: number = 1, pageSize: number = 10) {
  const skip = (currentPage - 1) * pageSize;
  const limit = currentPage * pageSize;
  return { skip, limit };
}


const getFirstThousandAdverseReactionsByNumberOfOccurrences = async (drugName: string, currentPage: number = 1, pageSize: number = 10): Promise<Drug> => {


  const { skip, limit } = getPaginationParams(currentPage, pageSize);

  const cacheKey = `drug_${drugName.toLowerCase()}`;
  let cachedResult = cache.get(cacheKey) as Drug;

  if (!cachedResult) {
    const hardCodedLimit = 1000;
    const baseURL = process.env.FDA_API_URL;
    const query = `count=patient.reaction.reactionmeddrapt.exact&search=patient.drug.openfda.brand_name:"${drugName}"+patient.drug.openfda.generic_name:"${drugName}"`;
    const url = `${baseURL}${query}&limit=${hardCodedLimit}`;

    const response = await axios.get<OpenFDABaseResponse>(url);
    const data = response.data;

    const responseData: Drug = {
      last_updated: data.last_updated,
      currentPage: currentPage,
      pageSize: pageSize,
      total: data.results.length,
      drugName: drugName,
      reactions: data.results.map((item: OpenFDACountResponse) => ({
        reactionName: item.term,
        count: item.count,
      }))
    };

    console.log(`Adding to cache: [${cacheKey}]`);
    cache.set(cacheKey, responseData);

    cachedResult = responseData;
  }

  return {
    ...cachedResult,
    currentPage: currentPage,
    pageSize: pageSize,
    reactions: cachedResult.reactions.slice(skip, limit),
  };
};

const updateAdserveReactionsCacheBackground = async () => {
  setInterval(getAdserveReactionsForCache, 86400 * 1000);
  getAdserveReactionsForCache(); // first call immediately  
};

const getAdserveReactionsForCache = async () => {
  try {
    const drugNames = ['Vimizim', 'AVASTIN', 'Aspen']; // List of top requested drugs
    for (const drugName of drugNames) {
      console.log(`Updating cache for: ${drugName}`);
      await getFirstThousandAdverseReactionsByNumberOfOccurrences(drugName, 1, 1000);
    }
    console.log('Background update complete.');
  } catch (error) {
    console.error('Error in background update:', error);
  }
};



export default {
  getFirstThousandAdverseReactionsByNumberOfOccurrences,
  updateAdserveReactionsCacheBackground
}; 