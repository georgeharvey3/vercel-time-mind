import { renderIncompleteTasks } from "../incomplete-tasks/incomplete-tasks";
import { Task } from "../../task";
import Storage from "../storage";
import { datediff } from "../../../utils/date";
const storage = new Storage();

export const renderTaskDays = () => {
  const data = storage.readAll();

  const incompleteTasks = data
    .filter((task) => !task.completed)
    .filter((task) => !task.running);

  const dayGroups = incompleteTasks.reduce((acc, val) => {
    if (Object.prototype.hasOwnProperty.call(acc, val.scheduledDate)) {
      return {
        ...acc,
        [val.scheduledDate]: [...acc[val.scheduledDate], val],
      };
    } else {
      return {
        ...acc,
        [val.scheduledDate]: [val],
      };
    }
  }, {});

  const asArray = Object.entries(dayGroups).sort((a, b) => {
    const date1 = new Date(a[0]).getTime();
    const date2 = new Date(b[0]).getTime();

    return date1 - date2;
  });

  const taskDays = document.querySelector("[data-task-days]");
  taskDays.innerHTML = "";

  for (const day of asArray) {
    // create task day div
    const taskDay = document.createElement("div");
    taskDay.classList.add("task-day");

    // create div for task day header
    const taskRow = document.createElement("div");
    taskRow.classList.add("task-day__row");

    // add title to header
    const h2 = document.createElement("h2");
    h2.classList.add("task-day__name");

    const difference = datediff(new Date(), new Date(day[0])) + 1;

    let dayname = day[0].toString();
    if (difference === 0) {
      dayname = "Today";
    } else if (difference == 1) {
      dayname = "Tomorrow";
    }
    h2.textContent = dayname;
    taskRow.appendChild(h2);

    // add button to header
    const button = document.createElement("button");
    button.dataset.date = day[0];
    button.dataset["see_all"] = "";
    button.classList.add("task-day__see-all");
    button.textContent = "See All";
    taskRow.appendChild(button);

    taskDay.appendChild(taskRow);

    // create div for tasks
    const incompleteTasks = document.createElement("div");
    incompleteTasks.classList.add("incomplete-tasks");
    incompleteTasks.dataset["task_date"] = day[0];

    // render incomplete tasks to div
    renderIncompleteTasks(incompleteTasks, day[1] as Task[]);

    taskDay.appendChild(incompleteTasks);

    taskDays.appendChild(taskDay);

    const playButtons = document.querySelectorAll(
      ".playbutton",
    ) as NodeListOf<HTMLImageElement>;

    if (playButtons.length > 0) {
      import("../play-button/play-button").then(({ PlayButton }) => {
        playButtons.forEach((playButton) => {
          new PlayButton(playButton);
        });
      });
    }
  }

  const seeAlls = document.querySelectorAll(
    "[data-see_all]",
  ) as NodeListOf<HTMLElement>;

  if (seeAlls.length > 0) {
    import("../see-all/see-all").then(({ SeeAll }) => {
      seeAlls.forEach((seeAll) => {
        new SeeAll(seeAll);
      });
    });
  }
};