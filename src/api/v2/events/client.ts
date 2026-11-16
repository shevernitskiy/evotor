import { Endpoint } from "../../../core/endpoint.ts";
import type { Event, EventType, Paging } from "../../../typings/v2/entities.ts";

/**
 * События приложения.
 *
 * Документация: https://developer.evotor.ru/docs/rest_api_get_events.html
 */
export class EventsApi extends Endpoint {
  /**
   * Возвращает события приложения за указанный период.
   *
   * `GET /apps/{application_id}/events`
   *
   * @param applicationId Идентификатор приложения в Облаке Эвотор.
   * @param params Параметры выборки событий.
   * @param params.type Тип событий, которые должны попасть в ответ. Можно указать несколько типов через запятую.
   * @param params.since Время в миллисекундах. Ответ содержит события, созданные в указанный момент и позже. Указывается только в первом запросе из серии постраничных запросов.
   * @param params.until Время в миллисекундах. Ответ содержит события, созданные строго до указанного момента. Если параметр не задан, значение определяется как текущая дата.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   */
  getEvents(
    applicationId: string,
    params: {
      type: EventType | EventType[];
      since?: number;
      until?: number;
      cursor?: string;
    },
  ): Promise<Paging<Event>> {
    return this.rest.get<Paging<Event>>({
      url: `/apps/${encodeURIComponent(applicationId)}/events`,
      query: {
        type: params.type,
        since: params.since,
        until: params.until,
        cursor: params.cursor,
      },
    });
  }

  /**
   * Возвращает событие приложения по идентификатору.
   *
   * `GET /apps/{application_id}/events/{event_id}`
   *
   * @param applicationId Идентификатор приложения в Облаке Эвотор.
   * @param eventId Идентификатор события.
   */
  getEvent(applicationId: string, eventId: string): Promise<Event> {
    return this.rest.get<Event>({
      url: `/apps/${encodeURIComponent(applicationId)}/events/${encodeURIComponent(eventId)}`,
    });
  }
}
