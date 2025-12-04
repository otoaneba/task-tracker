import pool from "../config/db.js";
import { TaskModel } from "../models/taskModel.js";
import { NotFoundError, AuthenticationError, ValidationError, Forbidden, QueryError } from "../utils/errors.js";


export const TaskService = {
  getTasksForUser: async function({userId}) {
    const allTasks = await TaskModel.findAll(userId);
    if (allTasks?.length === 0) {
      return [];
    }

    return allTasks;
  },
  getTaskById: async function({ taskId, userId }) {
    const task = await TaskModel.findTaskById(taskId, userId);
    
    if (!task) {
      throw new NotFoundError("Task", {id: taskId});
    }

    return task;
  },
  createTask: async function({userId, title, description, imageUrl, status, dueDate}) {
    // validate required fields
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new ValidationError("Title is required.", {title})
    }
    title = title.trim();
    
    // validate optional fields
    if (!status) {
      status = "todo";
    } else if (!["todo", "done"].includes(status)) {
      throw new ValidationError("Status must be 'todo' or 'done'", {status})
    }
    
    if (dueDate != null) { // check for both null and undefined 
      const parsedDate = typeof dueDate === "string" ? new Date(dueDate) : dueDate instanceof Date ? dueDate : null;
      
      if (parsedDate === null) {
        throw new ValidationError("dueDate must be a string or Date object"); 
      }

      if (isNaN(parsedDate.getTime())) { // "new Date(banana)"
        throw new ValidationError("dueDate is not a valid date");
      }

      dueDate = parsedDate;
    }
    
    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        throw new ValidationError("Image URL is invalid", {imageUrl});
      }
    }

    if (description != null) { // check for both null and undefined
      if (typeof description !== "string") {
        throw new ValidationError("Description must be a string.", { description });
      }
      description = description.trim();
    }

    const result = await TaskModel.createTask({userId, title, description, imageUrl, status, dueDate});

    return result;
  },
  updateTask: async function({taskId, userId, title, description, imageUrl, status, dueDate}) {
    const oldTask = await TaskModel.findTaskById(taskId, userId);

    if (oldTask == null) {
      throw new NotFoundError("Task was not found.", { taskId });
    }

    const mergedTasks = {
      taskId, userId, title: title !== undefined ? title : oldTask.title,
      description: description !== undefined ? description : oldTask.description,
      imageUrl: imageUrl !== undefined ? imageUrl : oldTask.imageUrl,
      status: status !== undefined ? status : oldTask.status,
      dueDate: dueDate !== undefined ? dueDate : oldTask.dueDate
    };

    // validate required fields
    if (typeof mergedTasks.title !== "string" || mergedTasks.title.trim().length === 0) {
      throw new ValidationError("Title is required.", {title: mergedTasks.title})
    }
    mergedTasks.title = mergedTasks.title.trim();

    // validate optional fields
    if (status !== undefined) { 
      // user is trying to change status -> NOW validate the new value
      if (!["todo", "done"].includes(mergedTasks.status)) {
        throw new ValidationError("Status must be either 'todo' or 'done'");
      }
    }

    if (dueDate !== undefined) {
      if (dueDate === null) { // intent action.
        mergedTasks.dueDate = dueDate;
      } else if (typeof dueDate === "string") {
        const parsedDate = new Date(dueDate);
  
        if (isNaN(parsedDate.getTime())) {
          throw new ValidationError("Date is not in a correct format.")
        }

        mergedTasks.dueDate = parsedDate; 

      } else if (dueDate instanceof Date) { // type validation. not intent. 
        mergedTasks.dueDate = dueDate;
      } else {
        throw new ValidationError("dueDate must be a string, Date, or null")
      }
    }

    if (mergedTasks.imageUrl !== undefined) {
      try {
        new URL(mergedTasks.imageUrl)
      } catch {
        throw new ValidationError("Image URL is invalid.")
      }
    }

    if (mergedTasks.description != null) {
      if (typeof mergedTasks.description !== "string") {
        throw new ValidationError("Description must be a string.")
      }
      mergedTasks.description = mergedTasks.description.trim()
    }

    const result = await TaskModel.updateTask({
      id: mergedTasks.taskId,
      userId: mergedTasks.userId,
      title: mergedTasks.title,
      description: mergedTasks.description,
      imageUrl: mergedTasks.imageUrl,
      status: mergedTasks.status,
      dueDate: mergedTasks.dueDate
    })

    return result;

  },
  deleteTask: async function({taskId, userId}) {

    const oldTask = await TaskModel.findTaskById(taskId, userId);

    if (oldTask === null) {
      throw new NotFoundError("Task was not found.", { taskId });
    }

    const result = await TaskModel.deleteTask({id: taskId, userId: userId});

    if (result === null) {
      throw new NotFoundError("Task was not found", { taskId })
    }

    return result

  }
} 