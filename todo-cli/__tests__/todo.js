/* eslint-disable no-undef */
const todolist = require("../todo");
const { all, add, overdue, dueLater, dueToday } = todolist();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};
const dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1)),
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1)),
);
describe("todo tests suite", () => {
  beforeAll(() => {
    add({
      title: " Rani the Heroin",
      dueDate: tomorrow,
      completed: false,
    });
    add({
      title: " the paid bills",
      dueDate: today,
      completed: false,
    });
  });
  test("should add a new todo ", () => {
    const testcount = all.length;
    add({
      title: " Raju the Hero",
      dueDate: yesterday,
      completed: false,
    });
    expect(all.length).toBe(testcount + 1);
  });
  test("marking", () => {
    all[0].completed = true;
    expect(all[0].completed).toBe(true);
  });

  test("overdue date", () => {
    const a = overdue();
    expect(a[0].dueDate).toBe(yesterday);
  });
  test("due today items", () => {
    const t = dueToday();
    expect(t[0].dueDate).toBe(today);
  });

  test("due tomorrow items", () => {
    const tomo = dueLater();
    expect(tomo[0].dueDate).toBe(tomorrow);
  });
});
