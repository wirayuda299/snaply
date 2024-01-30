import NotificationService from "../services/notification.service";
import { Request, Response } from "express";

export default class NotificationController {
  constructor(private notificationService: NotificationService) { }

  create(req: Request, res: Response) {
    return this.notificationService.createNotification(req, res);
  }

  deleteNotification(req: Request, res: Response) {
    return this.notificationService.deleteNotification(req, res);
  }
}
