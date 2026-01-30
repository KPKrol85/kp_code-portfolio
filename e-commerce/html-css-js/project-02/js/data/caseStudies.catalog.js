import { getLang } from "../content/index.js";
import {
  CASE_STUDIES as CASE_STUDIES_PL,
  getCaseStudyBySlug as getCaseStudyBySlugPl,
  getCaseStudiesByService as getCaseStudiesByServicePl,
} from "./caseStudies.catalog.pl.js";
import {
  CASE_STUDIES as CASE_STUDIES_EN,
  getCaseStudyBySlug as getCaseStudyBySlugEn,
  getCaseStudiesByService as getCaseStudiesByServiceEn,
} from "./caseStudies.catalog.en.js";

const CATALOGS = {
  pl: {
    items: CASE_STUDIES_PL,
    bySlug: getCaseStudyBySlugPl,
    byService: getCaseStudiesByServicePl,
  },
  en: {
    items: CASE_STUDIES_EN,
    bySlug: getCaseStudyBySlugEn,
    byService: getCaseStudiesByServiceEn,
  },
};

const getCatalog = () => CATALOGS[getLang()] || CATALOGS.pl;

export const getCaseStudyBySlug = (slug) => getCatalog().bySlug(slug);

export const getCaseStudiesByService = (serviceSlug) => getCatalog().byService(serviceSlug);

export const getCaseStudies = () => getCatalog().items;
