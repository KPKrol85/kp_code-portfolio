import { getLang } from "../content/index.js";
import {
  SERVICES as SERVICES_PL,
  SERVICES_PAGE as SERVICES_PAGE_PL,
  getServiceBySlug as getServiceBySlugPl,
} from "./services.catalog.pl.js";
import {
  SERVICES as SERVICES_EN,
  SERVICES_PAGE as SERVICES_PAGE_EN,
  getServiceBySlug as getServiceBySlugEn,
} from "./services.catalog.en.js";

const CATALOGS = {
  pl: { services: SERVICES_PL, page: SERVICES_PAGE_PL, bySlug: getServiceBySlugPl },
  en: { services: SERVICES_EN, page: SERVICES_PAGE_EN, bySlug: getServiceBySlugEn },
};

const getCatalog = () => CATALOGS[getLang()] || CATALOGS.pl;

export const getServicesPage = () => getCatalog().page;

export const getServices = () => getCatalog().services;

export const getServiceBySlug = (slug) => getCatalog().bySlug(slug);
