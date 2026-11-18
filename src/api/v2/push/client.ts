import { Endpoint } from "../../../core/endpoint.ts";
import type { JSONValue } from "../../../typings/lib.ts";
import type { PushNotification } from "../../../typings/v2/entities.ts";

/**
 * Push-уведомления для смарт-терминалов.
 *
 * Документация: https://developer.evotor.ru/docs/rest_push_notifications_guide.html
 */
export class PushApi extends Endpoint {
  /**
   * Возвращает push-уведомление по идентификатору.
   *
   * `GET /api/apps/{application_id}/push-notifications/{push-id}`
   *
   * @param applicationId Идентификатор приложения в Облаке Эвотор.
   * @param pushId Идентификатор push-уведомления.
   */
  getPush(applicationId: string, pushId: string): Promise<PushNotification> {
    return this.rest.get<PushNotification>({
      url: `/api/apps/${encodeURIComponent(applicationId)}/push-notifications/${encodeURIComponent(pushId)}`,
    });
  }

  /**
   * Передаёт push-уведомление на несколько смарт-терминалов.
   *
   * `POST /api/apps/{application_id}/push-notifications`
   *
   * @param applicationId Идентификатор приложения в Облаке Эвотор.
   * @param push Данные уведомления.
   * @param push.devices Идентификаторы смарт-терминалов, которым нужно передать уведомление. До 100 устройств.
   * @param push.active_until Дата и время, до которого уведомление остаётся активным. В документации Облака это поле указано как `active_untill`.
   * @param push.payload Данные уведомления. Не более 1900 символов.
   */
  sendPush(
    applicationId: string,
    push: {
      devices?: string[];
      active_until?: string | number;
      payload?: JSONValue;
    },
  ): Promise<PushNotification> {
    return this.rest.post<PushNotification>({
      url: `/api/apps/${encodeURIComponent(applicationId)}/push-notifications`,
      payload: push as JSONValue,
    });
  }

  /**
   * Передаёт push-уведомление на один смарт-терминал.
   *
   * `POST /api/apps/{application_id}/devices/{device_uuid}/push-notifications`
   *
   * @param applicationId Идентификатор приложения в Облаке Эвотор.
   * @param deviceUuid Идентификатор смарт-терминала или его IMEI.
   * @param push Данные уведомления.
   * @param push.active_until Дата и время, до которого уведомление остаётся активным.
   * @param push.payload Данные уведомления. Не более 1900 символов.
   */
  sendPushToDevice(
    applicationId: string,
    deviceUuid: string,
    push: {
      active_until?: string | number;
      payload?: JSONValue;
    },
  ): Promise<PushNotification> {
    return this.rest.post<PushNotification>({
      url: `/api/apps/${encodeURIComponent(applicationId)}/devices/${encodeURIComponent(deviceUuid)}/push-notifications`,
      payload: push as JSONValue,
    });
  }
}
