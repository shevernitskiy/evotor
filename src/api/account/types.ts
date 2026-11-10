import type { Device, Employee, Store } from "../../typings/entities.ts";

/** Ответ на запрос списка магазинов. */
export type ResponseGetStores = Store[];

/** Ответ на запрос списка сотрудников. */
export type ResponseGetEmployees = Employee[];

/** Ответ на запрос списка смарт-терминалов. */
export type ResponseGetDevices = Device[];
