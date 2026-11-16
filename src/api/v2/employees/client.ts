import { Endpoint } from "../../../core/endpoint.ts";
import type { JSONValue } from "../../../typings/lib.ts";
import type { Employee, EmployeeCreate, EmployeeUpdate, Paging, Role } from "../../../typings/v2/entities.ts";

/**
 * Сотрудники пользователя платформы Эвотор.
 *
 * Документация: https://developer.evotor.ru/docs/rest_employees.html
 */
export class EmployeesApi extends Endpoint {
  /**
   * Возвращает список сотрудников пользователя.
   *
   * `GET /employees`
   *
   * @param params Параметры выборки сотрудников.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   */
  getEmployees(params?: { cursor?: string }): Promise<Paging<Employee>> {
    return this.rest.get<Paging<Employee>>({
      url: "/employees",
      query: {
        cursor: params?.cursor,
      },
    });
  }

  /**
   * Возвращает данные сотрудника по идентификатору.
   *
   * `GET /employees/{employee-id}`
   *
   * @param employeeId Идентификатор сотрудника в Облаке Эвотор.
   */
  getEmployee(employeeId: string): Promise<Employee> {
    return this.rest.get<Employee>({
      url: `/employees/${encodeURIComponent(employeeId)}`,
    });
  }

  /**
   * Возвращает список ролей сотрудников.
   *
   * `GET /employees/roles`
   */
  getRoles(): Promise<Paging<Role>> {
    return this.rest.get<Paging<Role>>({
      url: "/employees/roles",
    });
  }

  /**
   * Добавляет сотрудника.
   *
   * `POST /employees`
   *
   * @param employee Данные нового сотрудника.
   * @param employee.phone Номер телефона сотрудника.
   * @param employee.role_id Идентификатор роли сотрудника.
   * @param employee.name Имя сотрудника.
   * @param employee.last_name Фамилия сотрудника.
   * @param employee.patronymic_name Отчество сотрудника.
   * @param employee.position Должность сотрудника.
   * @param employee.stores Идентификаторы магазинов, в которые нужно добавить сотрудника.
   */
  createEmployee(employee: EmployeeCreate): Promise<void> {
    return this.rest.post<void>({
      url: "/employees",
      payload: employee as JSONValue,
    });
  }

  /**
   * Обновляет параметры сотрудника.
   *
   * `PUT /employees/{employee-id}`
   *
   * @param employeeId Идентификатор сотрудника в Облаке Эвотор.
   * @param employee Новые параметры сотрудника.
   * @param employee.phone Номер телефона сотрудника.
   * @param employee.name Имя сотрудника.
   * @param employee.last_name Фамилия сотрудника.
   * @param employee.patronymic_name Отчество сотрудника.
   * @param employee.role_id Идентификатор роли сотрудника.
   * @param employee.inn ИНН сотрудника.
   * @param employee.stores Идентификаторы магазинов, в которые нужно добавить сотрудника.
   * @param employee.position Должность сотрудника.
   */
  updateEmployee(employeeId: string, employee: EmployeeUpdate): Promise<EmployeeUpdate> {
    return this.rest.put<EmployeeUpdate>({
      url: `/employees/${encodeURIComponent(employeeId)}`,
      payload: employee as JSONValue,
    });
  }
}
