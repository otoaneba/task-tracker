import { TaskService } from "../services/taskService";
import { AuthenticationError } from "../utils/errors";

export const TaskController = {
  getTasksForUser: async function(req, res, next) {
    try {

      const result = await TaskService.getTasksForUser({userId: req.user.id});

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getTaskById: async function(req, res, next) {
    try {

      const result = await TaskService.getTaskById({ taskId: req.params.taskId, userId: req.user.id })
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  createTask: async function(req, res, next) {
    try {
      //{userId, title, description, imageUrl, status, dueDate}
  
      const result = await TaskService.createTask({
        userId: req.user.id,
        title: req.body?.title,
        description: req.body?.description,
        imageUrl: req.body?.imageUrl,
        status: req.body?.status,
        dueDate: req.body?.dueDate  
      })
  
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  updateTask: async function(req, res, next) {
    try {
      // {taskId, userId, title, description, imageUrl, status, dueDate}
      const result = await TaskService.updateTask({
        userId: req.user.id,
        taskId: req.params.taskId,
        title: req.body?.title,
        description: req.body?.description,
        imageUrl: req.body?.imageUrl,
        status: req.body?.status,
        dueDate: req.body?.dueDate
      });

      return res.status(200).json({"success": true});

    } catch (error) {
      next(error);
    }
  },
  deleteTask: async function(req, res, next) {
    try {

      const result = await TaskService.deleteTask({taskId: req.params.taskId, userId: req.user.id});

      return res.status(200).json({"success": true});

    } catch (error) {
      next(error);
    }
  }
}



/** 
  ✔ GET /tasks
  ✔ GET /tasks/:id
  ✔ POST /tasks
  ✔ PATCH /tasks/:id
  ✔ DELETE /tasks/:id
 */
