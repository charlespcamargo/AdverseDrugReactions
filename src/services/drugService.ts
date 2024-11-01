import axios from 'axios';
import { Drug, DrugReaction } from '../models/Drug';
import { OpenFDABaseResponse } from '../models/serviceModels/OpenFDABaseResponse';
import { OpenFDACountResponse } from '../models/serviceModels/OpenFDACountResponse';
import {
  OpenFDASearchResponseItem,
  OpenFDASearchResponseItemPatientResponse,
  OpenFDASearchResponseItemPatientDrugReactionResponse
} from '../models/serviceModels/OpenFDASearchResponse';
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

  const cacheKey = `drug_${drugName.toLowerCase()}_top`;
  let cachedResult = cache.get(cacheKey) as Drug;

  if (!cachedResult) {
    const hardCodedLimit = 1000;
    const baseURL = process.env.FDA_API_URL;
    const query = `count=patient.reaction.reactionmeddrapt.exact&search=patient.drug.openfda.brand_name:"${drugName}"+patient.drug.openfda.generic_name:"${drugName}"`;
    const url = `${baseURL}${query}&limit=${hardCodedLimit}`;

    const response = await axios.get<OpenFDABaseResponse>(url);
    const data = response.data;

    const responseData: Drug = {
      last_updated: data.meta.last_updated,
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

const updateAdverseReactionsCacheBackground = async () => {
  setInterval(getAdverseReactionsForCache, 86400 * 1000);
  getAdverseReactionsForCache(); // first call immediately  
};

const getAdverseReactionsForCache = async () => {
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



const getAllAdverseReactions = async (drugName: string, currentPage: number = 1, pageSize: number = 10): Promise<Drug> => {


  const cacheKey = `drug_${drugName.toLowerCase()}`;
  let cachedResult = cache.get(cacheKey) as Drug;

  if (cachedResult) {
    const skip = (currentPage - 1) * pageSize;
    const limit = pageSize;

    return {
      ...cachedResult,
      currentPage: currentPage,
      pageSize: pageSize,
      reactions: cachedResult.reactions.slice(skip, limit),
    };
  }

  throw new Error("Data not available in cache. Background update might be in progress.");
};

const updateFullAdverseReactionsCacheBackground = async () => {
  setInterval(getFullAdverseReactionsForCache, 86400 * 1000);
  getFullAdverseReactionsForCache(); // first call immediately  
};

const getFullAdverseReactionsForCache = async () => {
  try {
    const drugNames = ['Vimizim', 'AVASTIN', 'Aspen']; // List of top requested drugs
    for (const drugName of drugNames) {

      const cacheKey = `drug_${drugName.toLowerCase()}`;
      let currentPage = 1;
      const pageSize = 1000;
      let reactions: DrugReaction[] = [];
      let totalPages: number = 0;
      let last_updated: Date;

      do {
        const result = await fetchDrugReactionsData(drugName, currentPage, pageSize);
        last_updated = result.last_updated

        if (currentPage === 1) {
          totalPages = Math.ceil(result.total / pageSize);
          console.log(`Total pages to cache for ${drugName}: ${totalPages}`);
        }
        else
          console.log(`Updating FULL cache for: ${drugName} - Page: ${currentPage}`);

        reactions = reactions.concat(result.reactions);
        currentPage++;
      } while (currentPage <= totalPages);

      const drugData: Drug = {
        last_updated: last_updated,
        currentPage: 1,
        pageSize: pageSize,
        total: reactions.length,
        drugName: drugName,
        reactions: reactions
      };

      console.log(`Adding complete data to cache: [${cacheKey}]`);
      cache.set(cacheKey, drugData);
    }
    console.log('Background update complete. [FULL]');
  } catch (error) {
    console.error('Error in background update[FULL]:', error);
  }
};


const fetchDrugReactionsData = async (drugName: string, currentPage: number, pageSize: number): Promise<Drug> => {
  const baseURL = process.env.FDA_API_URL;
  const skip = (currentPage - 1) * pageSize;
  const query = `search=patient.drug.openfda.brand_name:"${drugName}"+patient.drug.openfda.generic_name:"${drugName}"`;
  const url = `${baseURL}${query}&skip=${skip}&limit=${pageSize}`;
  const response = await axios.get<OpenFDABaseResponse>(url);

  const reactions: DrugReaction[] = [];

  response.data.results.map((item: OpenFDASearchResponseItem) =>
    item.patient.reaction.forEach((patientDrugReaction) => {

      const outcome = Number(patientDrugReaction.reactionoutcome) || 0;
      const existingReaction = reactions.find(
        (reaction) => reaction.reactionName == patientDrugReaction.reactionmeddrapt
      );

      if (existingReaction) {
        existingReaction.count += outcome;
      } else {
        reactions.push(new DrugReaction(patientDrugReaction.reactionmeddrapt, outcome));
      }
    })
  );

  reactions.sort((a, b) => b.count - a.count);

  return {
    last_updated: response.data.meta.last_updated,
    currentPage: currentPage,
    pageSize: pageSize,
    total: response.data.meta.results.total,
    drugName: drugName,
    reactions: reactions
  };
};

export default {
  getFirstThousandAdverseReactionsByNumberOfOccurrences,
  updateAdverseReactionsCacheBackground,

  getAllAdverseReactions,
  updateFullAdverseReactionsCacheBackground,
}; 